/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.jcluster.webTest.controller;

import org.jcluster.webTest.controller.entity.Dummy;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import org.jcluster.core.JcFactory;
import org.jcluster.core.config.JcAppConfig;

/**
 *
 * @author henry
 */
@Singleton
@Startup
public class DataInitializer {

    private static final Logger LOG = Logger.getLogger(DataInitializer.class.getName());

    private final HashMap<String, Dummy> dataMap = new HashMap<>();

    private final List<String> emptyMsg = new ArrayList<>();
    private final List<String> smallData = new ArrayList<>();
    private final List<String> bigData = new ArrayList<>();

    @PostConstruct
    public void init() {

//        for (int i = 0; i < 100; i++) {
//            smallData.add("1234567890_" + i);
//        }
//
//        for (int i = 0; i < 100_000; i++) {
//            bigData.add("1234567890_" + i);
//        }
//
//        
//        Integer port = JcAppConfig.getINSTANCE().getPort();
//        String hostName = JcAppConfig.getINSTANCE().getHostName();
//        String appName = JcAppConfig.getINSTANCE().getAppName();
//
//        //Initialize J-Cluster for this app
////        JcFactory.initManager(appName, hostName, port);
//
//        //For Testing, add values to filter here
//        String ser;
//        if (port == 4566) {
//            ser = "SLV01234";
//            dataMap.put("Nathan", new Dummy("Nathan", "Brill"));
//            dataMap.put("Lawrence", new Dummy("Lawrence", "Biffy"));
//        } else {
//            ser = "SLV012345";
//            dataMap.put("Pieter", new Dummy("Pieter", "Oberholzer"));
//            dataMap.put("Kostadin", new Dummy("Kostadin", "Petkov"));
//        }
//
//        JcFactory.getManager().addFilter("loggerSerial", ser);
//
//        //Adding some dummy data
//        for (Map.Entry<String, Dummy> entry : dataMap.entrySet()) {
//            String key = entry.getKey();
//
//            JcFactory.getManager().addFilter("name", key);
//        }
    }

    public HashMap<String, Dummy> getDataMap() {
        return dataMap;
    }

    public List<String> getEmptyMsg() {
        return emptyMsg;
    }

    public List<String> getSmallData() {
        return smallData;
    }

    public List<String> getBigData() {
        return bigData;
    }

}
