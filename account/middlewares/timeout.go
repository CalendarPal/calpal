package middlewares

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/CalendarPal/calpal/account/utils/apperrors"
	"github.com/gin-gonic/gin"
)

func Timeout(timeout time.Duration, errTimeout *apperrors.Error) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Custom writer
		tw := &timeoutWriter{ResponseWriter: c.Writer, h: make(http.Header)}
		c.Writer = tw

		// Wrap the request context with a timeout
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		// Update gin request context
		c.Request = c.Request.WithContext(ctx)

		finished := make(chan struct{})
		panicChan := make(chan interface{}, 1)

		go func() {
			defer func() {
				if p := recover(); p != nil {
					panicChan <- p
				}
			}()

			c.Next()
			finished <- struct{}{}
		}()

		select {
		case <-panicChan:
			// If the panic is unrecoverable, send an internal server error
			e := apperrors.NewInternal()
			tw.ResponseWriter.WriteHeader(e.Status())
			eResp, _ := json.Marshal(gin.H{
				"error": e,
			})
			_, err := tw.ResponseWriter.Write(eResp)
			if err != nil {
				return
			}
		case <-finished:
			// If finished, set headers and write response
			tw.mu.Lock()
			defer tw.mu.Unlock()
			// Map Headers from tw.Header() to tw.ResponseWriter for response
			dst := tw.ResponseWriter.Header()
			for k, vv := range tw.Header() {
				dst[k] = vv
			}
			tw.ResponseWriter.WriteHeader(tw.code)
			_, err := tw.ResponseWriter.Write(tw.wbuf.Bytes())
			if err != nil {
				return
			}
		case <-ctx.Done():
			// Timeout has occurred, send errTimeout and write headers
			tw.mu.Lock()
			defer tw.mu.Unlock()
			// ResponseWriter from gin
			tw.ResponseWriter.Header().Set("Content-Type", "application/json")
			tw.ResponseWriter.WriteHeader(errTimeout.Status())
			eResp, _ := json.Marshal(gin.H{
				"error": errTimeout,
			})
			_, err := tw.ResponseWriter.Write(eResp)
			if err != nil {
				return
			}
			c.Abort()
			tw.SetTimedOut()
		}
	}
}

// Implements http.Writer but tracks if Writer has timed out
type timeoutWriter struct {
	gin.ResponseWriter
	h           http.Header
	wbuf        bytes.Buffer
	mu          sync.Mutex
	timedOut    bool
	wroteHeader bool
	code        int
}

// Writes the response, but first makes sure there hasn't already been a timeout
func (tw *timeoutWriter) Write(b []byte) (int, error) {
	tw.mu.Lock()
	defer tw.mu.Unlock()
	if tw.timedOut {
		return 0, nil
	}

	return tw.wbuf.Write(b)
}

func (tw *timeoutWriter) WriteHeader(code int) {
	checkWriteHeaderCode(code)
	tw.mu.Lock()
	defer tw.mu.Unlock()
	if tw.timedOut || tw.wroteHeader {
		return
	}
	tw.writeHeader(code)
}

// Set that the header has been written
func (tw *timeoutWriter) writeHeader(code int) {
	tw.wroteHeader = true
	tw.code = code
}

// Header "relays" the header "h" from struct
func (tw *timeoutWriter) Header() http.Header {
	return tw.h
}

// SetTimedOut Sets timedOut field to true
func (tw *timeoutWriter) SetTimedOut() {
	tw.timedOut = true
}

func checkWriteHeaderCode(code int) {
	if code < 100 || code > 999 {
		panic(fmt.Sprintf("invalid WriteHeader code %v", code))
	}
}
