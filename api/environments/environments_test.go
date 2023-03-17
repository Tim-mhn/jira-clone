package environments

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

// todo: fix these tests

func TestConfigIsValid(t *testing.T) {

	t.Run("it should return false is config is missing fields", func(t *testing.T) {
		var c Config

		isValid, _ := configIsValid(c)

		assert.False(t, isValid)
	})

	t.Run("it should return false is config is missing values in nested fields", func(t *testing.T) {
		c := Config{
			Host:     "local",
			Port:     "8000",
			Database: DatabaseConfig{},
		}

		isValid, _ := configIsValid(c)

		assert.False(t, isValid)
	})

	t.Run("it should return the list of fields which have an missing value", func(t *testing.T) {
		c := Config{
			Port: "8000",
			Database: DatabaseConfig{
				Driver: "pg",
				URL:    "ceacaecaec",
			},
			Mailjet: MailjetConfig{
				ApiKey:    "xxxx",
				SecretKey: "yyyyy",
				Sender: MailjetSenderConfig{
					Email: "xxxxx",
					Name:  "cccccc",
				},
			},
			ClientDomain: ".tim-jira.live",
			ClientURL:    "https://tim-jira.live",
		}

		_, invalidFields := configIsValid(c)

		expectedInvalidFields := []string{"Host", "NotificationsAPIURL"}
		assert.EqualValues(t, expectedInvalidFields, invalidFields)
	})

	t.Run("it should return the list of sub-fields which have an missing value", func(t *testing.T) {
		c := Config{
			Port: "8000",
			Database: DatabaseConfig{
				Driver: "pg",
			},
			Mailjet: MailjetConfig{
				ApiKey:    "xxxx",
				SecretKey: "yyyyy",
				Sender: MailjetSenderConfig{
					Email: "xxxxx",
				},
			},
			NotificationsAPIURL: "https://notifications.api",
		}

		_, invalidFields := configIsValid(c)

		expectedInvalidFields := []string{"Host", "Mailjet.Sender.Name", "Database.URL", "ClientDomain", "ClientURL"}
		equalArrays := assert.ObjectsAreEqualValues(expectedInvalidFields, invalidFields)

		assert.True(t, equalArrays, fmt.Sprintf(`expected %q. Got %q`, expectedInvalidFields, invalidFields))
	})
}
