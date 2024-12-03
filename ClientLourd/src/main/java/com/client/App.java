package com.client;


import org.jxmapviewer.JXMapViewer;
import org.jxmapviewer.OSMTileFactoryInfo;
import org.jxmapviewer.painter.CompoundPainter;
import org.jxmapviewer.painter.Painter;
import org.jxmapviewer.viewer.*;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

/**
 * Hello world!
 *
 */
public class App 
{
    public static JXMapViewer mapViewer = new JXMapViewer();

    public static void main(String[] args) {
        // Create a frame to display the map
        JFrame frame = new JFrame("Interactive Map with Route Display");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 600);

        // Set up OpenStreetMap tile factory
        TileFactoryInfo info = new OSMTileFactoryInfo();
        DefaultTileFactory tileFactory = new DefaultTileFactory(info);
        mapViewer.setTileFactory(tileFactory);

        // Create initial focus position (center of Europe)
        GeoPosition center = new GeoPosition(43.609621, 7.076429);
        mapViewer.setAddressLocation(center);
        mapViewer.setZoom(8);

        // Create a panel for controls
        JPanel controlPanel = new JPanel(new FlowLayout());
        JTextField originField = new JTextField(15);
        JTextField destinationField = new JTextField(15);
        JButton findRouteButton = new JButton("Find Route");

        controlPanel.add(new JLabel("Origin:"));
        controlPanel.add(originField);
        controlPanel.add(new JLabel("Destination:"));
        controlPanel.add(destinationField);
        controlPanel.add(findRouteButton);

        frame.getContentPane().add(controlPanel, BorderLayout.NORTH);
        frame.getContentPane().add(mapViewer, BorderLayout.CENTER);

        // Button action to find a route
        findRouteButton.addActionListener((ActionEvent e) -> {
            String origin = originField.getText();
            String destination = destinationField.getText();

            if (origin.isEmpty() || destination.isEmpty()) {
                JOptionPane.showMessageDialog(frame, "Please enter both origin and destination.", "Input Error", JOptionPane.ERROR_MESSAGE);
                return;
            }

            // Simulate fetching route from a service
            fetchRouteFromService(origin, destination);
        });

        // Show the frame
        frame.setVisible(true);
    }
    private static void fetchRouteFromService(String origin, String destination) {
        // Simulate coordinates for the route
        StationService mop = new StationService();
        IStationServiceSoap proxyMath = mop.getBasicHttpBindingIStationServiceSoap();
        String r = proxyMath.getItinerary(origin, destination, "start");
        System.out.println("Resultat du subtract = "+r);
        StompQueueConsumer.main(null);
    }

    public static void updateMapWithRoute(ArrayList<GeoPosition> route) {
        // Create a route painter
        sample2_waypoints.RoutePainter routePainter = new sample2_waypoints.RoutePainter(route);


        ArrayList<Painter<JXMapViewer>> painters = new ArrayList<>();
        painters.add(routePainter);

        CompoundPainter<JXMapViewer> compoundPainter = new CompoundPainter<>(painters);
        mapViewer.setOverlayPainter(compoundPainter);

        // Adjust the zoom and focus to fit the route
        mapViewer.zoomToBestFit(new HashSet<>(route), 0.7);
    }
}
