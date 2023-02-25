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

type Config struct {
	Database DatabaseConfig
	Mailjet  MailjetConfig
	Host     string
	Port     string
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
	viper.BindEnv("mailjet.sender.name")
	viper.BindEnv("mailjet.api_key")
	viper.BindEnv("mailjet.secret_key")
	viper.BindEnv("host")
	viper.BindEnv("port")

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
		panic(fmt.Errorf("[Environment] error when unmarshalling variables into config : %w", err))
	}

	return nil
}

func checkConfigAndPanicIfInvalid(config Config) {
	configIsValid, invalidFields := configIsValid(config)

	if !configIsValid {

		panic(fmt.Errorf("[Environment] environments configuration not valid. Current config %s\nThe following fields are missing %q", config, invalidFields))
	}
}

func configIsValid(config Config) (bool, []string) {
	var invalidFields []string
	isValid := !structs.HasZero(config)

	if !isValid {

		host := config.Host
		if host == "" {
			invalidFields = append(invalidFields, "Host")
		}

		if config.Port == "" {
			invalidFields = append(invalidFields, "Port")
		}

		mailjetConfig := config.Mailjet

		if structs.HasZero(mailjetConfig) {
			if mailjetConfig.ApiKey == "" {
				invalidFields = append(invalidFields, "Mailjet.ApiKey")
			}
			if mailjetConfig.SecretKey == "" {
				invalidFields = append(invalidFields, "Mailjet.SecretKey")
			}
			if mailjetConfig.Sender.Email == "" {
				invalidFields = append(invalidFields, "Mailjet.Sender.Email")
			}
			if mailjetConfig.Sender.Name == "" {
				invalidFields = append(invalidFields, "Mailjet.Sender.Name")
			}

		}

		if structs.HasZero(config.Database) {

			if config.Database.Driver == "" {
				invalidFields = append(invalidFields, "Database.Driver")
			}

			if config.Database.URL == "" {
				invalidFields = append(invalidFields, "Database.URL")
			}

		}

	}

	return isValid, invalidFields
}

func GetConfig() Config {
	return *_config
}
