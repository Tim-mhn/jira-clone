package notifications_api

import (
	"context"
	"encoding/json"
	"time"

	"github.com/rabbitmq/amqp091-go"
	"github.com/tim-mhn/figma-clone/environments"
)

var mqConnection *amqp091.Connection

func getConnectionOrConnectForTheFirstTime() (*amqp091.Connection, error) {
	if mqConnection != nil {
		return mqConnection, nil
	}

	conn, err := amqp091.Dial(environments.GetConfig().RabbitMQURI)

	if err != nil {
		return &amqp091.Connection{}, err
	}

	return conn, nil

}

func openPubSubChannel(name string) (*amqp091.Channel, error) {
	conn, err := getConnectionOrConnectForTheFirstTime()
	if err != nil {
		return &amqp091.Channel{}, err
	}
	ch, err := conn.Channel()
	if err != nil {
		return &amqp091.Channel{}, err
	}

	durable := true
	autoDelete := false
	internal := false
	noWait := false
	err = ch.ExchangeDeclare(name, "fanout", durable, autoDelete, internal, noWait, nil)

	return ch, err
}

func publishJSONDataOverChannel(channel *amqp091.Channel, exchangeName string, jsonData interface{}) error {
	defer channel.Close()
	dataAsBytes, err := json.Marshal(jsonData)

	if err != nil {
		return err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	NO_ROUTING_KEY := ""
	mandatory := false
	immediate := false
	err = channel.PublishWithContext(ctx,
		exchangeName,
		NO_ROUTING_KEY,
		mandatory,
		immediate,
		amqp091.Publishing{
			ContentType: "application/json",
			Body:        dataAsBytes,
		})

	return err

}
