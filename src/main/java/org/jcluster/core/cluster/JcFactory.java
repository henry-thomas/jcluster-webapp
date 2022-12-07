/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.jcluster.core.cluster;

/**
 *
 * @author henry
 */
public class JcFactory {

    public static ClusterManager initManager(String appName, String ipAddress, Integer port) {
        return ClusterManager.getInstance().initConfig(appName, ipAddress, port);
    }

    public static ClusterManager getManager() {
        return ClusterManager.getInstance();
    }
}
