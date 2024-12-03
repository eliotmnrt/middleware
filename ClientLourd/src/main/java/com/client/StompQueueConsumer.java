package com.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.jxmapviewer.viewer.GeoPosition;

import javax.jms.Connection;
import javax.jms.Destination;
import javax.jms.ExceptionListener;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.Session;
import javax.jms.TextMessage;
import java.util.ArrayList;
import java.util.List;

public class StompQueueConsumer {

    public static void main(String[] args) {
        QueueConsumer consumer = new QueueConsumer(new QueueConsumer.MessageListener() {
            @Override
            public void onMessage(String message) throws JsonProcessingException {
                MyMessageProcessor.processMessage(message);
            }
        });

        new Thread(consumer).start();
    }


    public static class QueueConsumer implements Runnable, ExceptionListener {
        private MessageListener listener;

        public QueueConsumer(MessageListener listener) {
            this.listener = listener;
        }

        @Override
        public void run() {
            try {
                ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://localhost:61616");
                Connection connection = connectionFactory.createConnection();
                connection.start();
                connection.setExceptionListener(this);

                Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
                Destination destination = session.createQueue("itineraryQueue");
                MessageConsumer consumer = session.createConsumer(destination);

                System.out.println("Waiting for message...");
                Message message = consumer.receive();

                if (message instanceof TextMessage) {
                    String text = ((TextMessage) message).getText();
                    System.out.println("Received:");

                    // Notify the listener
                    if (listener != null) {
                        listener.onMessage(text);
                    }
                }

                consumer.close();
                session.close();
                connection.close();
            } catch (Exception e) {
                System.out.println("Caught: " + e);
                e.printStackTrace();
            }
        }

        @Override
        public void onException(JMSException e) {
            System.out.println("JMS Exception occurred. Shutting down client.");
        }

        public interface    MessageListener {
            void onMessage(String message) throws JsonProcessingException;
        }
    }

    static class MyMessageProcessor {
        public static void processMessage(String message) throws JsonProcessingException {
            ArrayList<GeoPosition> route = new ArrayList<>();
            ObjectMapper objectMapper = new ObjectMapper();

            // Parser le JSON dans un JsonNode
            JsonNode rootNode = objectMapper.readTree(message);

            // Accéder à features[0].geometry.coordinates
            for (int i = 0; i < rootNode.size(); i++) {
                JsonNode coordinatesNode = rootNode.get(i).path("geometry").path("coordinates");
                if (coordinatesNode.isArray()) {
                    for (JsonNode coordinatePair : coordinatesNode) {
                        double longitude = coordinatePair.get(0).asDouble();
                        double latitude = coordinatePair.get(1).asDouble();
                        route.add(new GeoPosition(latitude, longitude));
                    }
                } else {
                    System.out.println("Coordinates node is not an array.");
                }
            }
            App.updateMapWithRoute(route);
        }
    }
}
