package environments

import (
	"fmt"
	"strings"

	"github.com/spf13/viper"
)

type MailjetSenderConfig struct {
	Email string
	Name  string
}
type MailjetConfig struct {
	ApiKey    string `mapstructure:"api_key"`
	SecretKey string `mapstructure:"secret_key"`
	Sender    MailjetSenderConfig
}

type DatabaseConfig struct {
	Driver string
	URL    string
}

type ServerConfig struct {
	Host string
	Port string
}
type Config struct {
	Database DatabaseConfig
	Mailjet  MailjetConfig
	Server   ServerConfig
}

func LoadVariables() {

	err := loadVariablesFromConfigFile()

	if err == EnvironmentConfigFileNotFound {
		loadFromEnvironment()
	}

}

var _config *Config

func loadFromEnvironment() {
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.BindEnv("database.driver")
	viper.BindEnv("database.url")
	viper.BindEnv("mailjet.sender.email")

	err := viper.Unmarshal(&_config)

	if err != nil {
		fmt.Print(err)
	}

}

func loadVariablesFromConfigFile() EnvironmentsError {
	viper.SetConfigFile("config.yml")
	if err := viper.ReadInConfig(); err != nil {
		return EnvironmentConfigFileNotFound
	}

	err := viper.Unmarshal(&_config)

	if err != nil {
		panic(fmt.Errorf("error when unmarshalling variables into config : %w", err))
	}

	return nil
}

func GetConfig() Config {
	return *_config
}
