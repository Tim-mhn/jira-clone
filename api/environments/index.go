package environments

import (
	"fmt"

	"github.com/spf13/viper"
)

func LoadVariables() {

	viper.AutomaticEnv()

	if isDevelopment() {
		loadVariablesFromConfigFile()
	}

}

func loadVariablesFromConfigFile() {
	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		panic(fmt.Errorf("fatal error config file: %w", err))
	}
}

func isDevelopment() bool {
	env := GetEnv("environment")
	return env != "production"
}

func GetEnv(key string) string {
	return viper.GetString(key)
}
