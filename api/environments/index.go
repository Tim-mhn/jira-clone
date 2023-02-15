package environments

import (
	"fmt"
	"os"

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
	env := os.Getenv("environment")
	fmt.Printf("environment = %s", env)
	return env == "develop"
}

func GetEnv(key string) string {
	if isDevelopment() {
		return viper.GetString(key)
	}

	return os.Getenv(key)

}
