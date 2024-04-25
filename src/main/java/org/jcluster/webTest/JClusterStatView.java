/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.jcluster.webTest;

import java.io.Serializable;
import java.util.logging.Logger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import javax.annotation.PostConstruct;
import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import org.jcluster.core.bean.JcAppDescriptor;
import org.jcluster.core.bean.JcConnectionMetrics;
import org.jcluster.core.JcFactory;
import org.jcluster.core.bean.JcInstanceResMetrics;
import org.jcluster.core.bean.JcMetrics;
import org.jcluster.core.monitor.AppMetricMonitorInterface;
import org.jcluster.webTest.interfaces.JcTestRemoteInterface;
import org.jcluster.webTest.util.PfUtil;
import org.primefaces.shaded.json.JSONObject;

/**
 *
 * @author henry
 */
@RequestScoped
@Named
public class JClusterStatView implements Serializable {

    private static final Logger LOG = Logger.getLogger(JClusterStatView.class.getName());

    private final List<String> emptyMsg = new ArrayList<>();
    private final List<String> smallData = new ArrayList<>();
    private final List<String> bigData = new ArrayList<>();

//    private List<JcConnectionMetrics> allMetrics;
    private List<JcConnectionMetrics> inboundMetrics;
    private List<JcConnectionMetrics> outboundMetrics;
    private List<JcConnectionMetrics> allMetrics = new ArrayList<>();
    private JcAppDescriptor appDescriptor;
    private int delay_ms = 1000;
    private int multipleCalls = 1000;
    private int multipleThreads = 5;

    private int dataSizeInKb = 1000;
    private String filter = "Pieter";
    private String instanceId = "";

    private Object largeDataResult;

    private long timeTaken = 0l;
    private String result;

    @Inject
    JcTestRemoteInterface iFace;

    @Inject
    AppMetricMonitorInterface jcMonitor;

    @PostConstruct
    public void init() {
        appDescriptor = JcFactory.getManager().getInstanceAppDesc();
//        allMetrics = JcFactory.getManager().getAllMetrics();
    }

    public long getTimeTaken() {

        return timeTaken;
    }

    public void setTimeTaken(long timeTaken) {
        this.timeTaken = timeTaken;
    }

    public JcAppDescriptor getAppDescriptor() {
        return appDescriptor;
    }

    public void updateMetrics() {
        Map requestParameterMap = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();

        HashSet<String> remoteAppNameList = JcFactory.getManager().getRemoteAppNameList();
        allMetrics.clear();
        List<JcConnectionMetrics> list = new ArrayList<>();

        Map<String, List<JcConnectionMetrics>> allMetricsMap = new HashMap<>();
        Map<String, JcInstanceResMetrics> allResMap = new HashMap<>();
        for (String appName : remoteAppNameList) {
            allMetricsMap.put(appName, new ArrayList<>());
            try {

                JcMetrics metrics = jcMonitor.getMetricsMap(appName);
                JcInstanceResMetrics jcResMetrics = metrics.getResBean().getMetrics();
                allResMap.put(appName, jcResMetrics);

                Map<String, List<JcConnectionMetrics>> metricsMap = metrics.getConnMetricsMap();
                for (Map.Entry<String, List<JcConnectionMetrics>> entry : metricsMap.entrySet()) {
                    String key = entry.getKey();
                    List<JcConnectionMetrics> val = entry.getValue();

                    allMetricsMap.get(appName).addAll(val);
                    list.addAll(val);
                }
//                for (Map.Entry<String, List<JcConnectionMetrics>> entry : metricsMap.entrySet()) {
//                    allMetricsMap.get(appName).addAll(entry.getValue());
//                }
            } catch (Exception e) {
//                LOG.log(Level.WARNING, null, e);
            }
        }
        allMetrics.addAll(list);

        JSONObject response = new JSONObject(allMetricsMap);
        PfUtil.executeJs("updateMetrics", response.toString());

        JSONObject metricsResp = new JSONObject(allResMap);
        PfUtil.executeJs("updateResMetrics", metricsResp.toString());
    }

    public void testKillInstanceIdConnections() {
//        try {
//            long start = System.currentTimeMillis();
//            int cic = JcFactory.getManager().closeInboundConnections(instanceId);
//            int coc = JcFactory.getManager().closeOutboundConnections(instanceId);
//            long end = System.currentTimeMillis();
//            result = "Test Close Connection For InstanceId:" + instanceId
//                    + " Outbound: " + coc
//                    + " Inbound: " + cic
//                    + " Complete in: " + (end - start) + "ms";
//        } catch (Exception e) {
//            result = "testKillInstanceIdConnections Exception: " + e.getMessage();
//        }
    }

    public List<JcConnectionMetrics> getAllMetrics() {

        return allMetrics;
    }

    public String getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }

    public String getResult() {
        return result;
    }

}
