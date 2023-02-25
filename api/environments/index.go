package environments

import (
	"fmt"
	"log"
	"strings"

	"github.com/fatih/structs"
	"github.com/spf13/viper"
)

type MailjetSenderConfig struct {
	Email string
	Name  string
}
type MailjetConfig struct {
	ApiKey    string `mapstructure:"api_key" `
	SecretKey string `mapstructure:"secret_key" `
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
	Hello    string
}

func LoadVariables() {

	err := loadVariablesFromConfigFile()

	if err == EnvironmentConfigFileNotFound {
		loadFromEnvironment()
	}

	checkConfigAndPanicIfInvalid(*_config)
	log.Print("[Environment] Successfully loaded environment variables")

}

var _config *Config

func loadFromEnvironment() {

	log.Print("[Environment] Loading environment variables from os environment")

	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.BindEnv("database.driver")
	viper.BindEnv("database.url")
	viper.BindEnv("mailjet.sender.email")
	viper.BindEnv("mailjet.send.name")
	viper.BindEnv("mailjet.api_key")
	viper.BindEnv("mailjet.secret_key")
	viper.BindEnv("server.host")
	viper.BindEnv("server.host")

	err := viper.Unmarshal(&_config)

	if err != nil {
		fmt.Print(err)
	}

}

func loadVariablesFromConfigFile() EnvironmentsError {
	log.Print("[Environment] Loading environment variables from configuration file")

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

func checkConfigAndPanicIfInvalid(config Config) {
	configIsValid := !structs.HasZero(config)

	if !configIsValid {
		panic(fmt.Errorf("environments configuration not valid. Some fields are missing. Current config %s", config))
	}
}

func GetConfig() Config {
	return *_config
}
