package config

import (
	"strings"

	"github.com/spf13/viper"
)

func InitConfig() {
	initDefaults()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()
}

func initDefaults() {
	viper.SetDefault("db.name", "")
	viper.SetDefault("db.user", "")
	viper.SetDefault("db.pass", "")
	viper.SetDefault("db.host", "")
	viper.SetDefault("db.port", "")
}
