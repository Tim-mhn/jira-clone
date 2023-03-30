package notifications_api

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

var mqConnection *amqp091.Connection

func getConnectionOrConnectForTheFirstTime() *amqp091.Connection {
	if mqConnection != nil {
		return mqConnection
	}

	conn, err := amqp091.Dial("amqp://guest:guest@localhost:5672/")

	if err != nil {
		log.Fatalf("Error when connecting to Message Queue %e", err)
	}

	return conn

}

func openPubSubChannel(name string) (*amqp091.Channel, error) {
	conn := getConnectionOrConnectForTheFirstTime()

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
