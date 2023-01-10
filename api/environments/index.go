package environments

import (
	"github.com/spf13/viper"
)

func LoadVariables() error {
	viper.SetConfigName("config")

	viper.AddConfigPath(".")

	viper.AutomaticEnv()

	viper.SetConfigType("yml")

	if err := viper.ReadInConfig(); err != nil {
		return err
	}

	return nil
}

func GetEnv(key string) string {
	return viper.GetString(key)
}
