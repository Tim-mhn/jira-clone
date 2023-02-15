package environments

import (
	"github.com/spf13/viper"
)

func LoadVariables() error {
	viper.SetConfigFile(".env")

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return err
	}

	return nil
}

func GetEnv(key string) string {
	return viper.GetString(key)
}
