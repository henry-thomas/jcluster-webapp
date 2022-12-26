/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.jcluster.webTest;

import java.io.Serializable;
import java.util.logging.Logger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.PostConstruct;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import org.jcluster.core.bean.JcAppDescriptor;
import org.jcluster.core.bean.JcConnectionMetrics;
import org.jcluster.core.cluster.JcFactory;
import org.jcluster.webTest.interfaces.JcTestRemoteInterface;

/**
 *
 * @author henry
 */
@RequestScoped
@Named
public class CoolView implements Serializable {

    private static final Logger LOG = Logger.getLogger(CoolView.class.getName());

    private final List<String> emptyMsg = new ArrayList<>();
    private final List<String> smallData = new ArrayList<>();
    private final List<String> bigData = new ArrayList<>();

//    private List<JcConnectionMetrics> allMetrics;
    private List<JcConnectionMetrics> inboundMetrics;
    private List<JcConnectionMetrics> outboundMetrics;
    HashMap<String, List<JcConnectionMetrics>> allMetrics;
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

    @PostConstruct
    public void init() {
        appDescriptor = JcFactory.getManager().getInstanceAppDesc();
        allMetrics = JcFactory.getManager().getAllMetrics();
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

    public void testFilterAndReturn() {
        try {
            long start = System.currentTimeMillis();
            String surname = iFace.jcTestFilterAndReturn(filter).getSurname();
            long end = System.currentTimeMillis();
            result = "Return:" + surname + " in: " + +(end - start) + "ms";
        } catch (Exception e) {
            result = "Exception: " + e.getMessage();
        }

    }

    public void testThrowException() {
        try {
            long start = System.currentTimeMillis();
            iFace.jcTestThrowException(new Exception("Test Random Exception"));
            long end = System.currentTimeMillis();
            result = "TestException FAIL! in " + (end - start) + "ms";
        } catch (Exception e) {
            result = "Exception: " + e.getMessage();
        }

    }

    private int sucecssCalls = 0;
    private int thCompleted = 0;
    private final Object thLock = new Object();

    public void testNoReturnMultiple() {
        if (multipleThreads <= 0) {
            multipleThreads = 1;
        } else if (multipleThreads > 100) {
            multipleThreads = 100;
        }
        if (multipleCalls < multipleThreads) {
            multipleCalls = multipleThreads;
        }
        byte b[] = new byte[dataSizeInKb * 1024];
        int itterationPerThread = multipleCalls / multipleThreads;

        List<Thread> thList = new ArrayList<>();
        for (int i = 0; i < multipleThreads; i++) {
            thList.add(new Thread(new Runnable() {

                @Override
                public void run() {
                    int localSuccess = 0;
                    for (int j = 0; j < itterationPerThread; j++) {
                        try {
                            iFace.jcTestReturnSame(b);
                            localSuccess++;
                        } catch (Exception e) {
                        }
                    }
                    synchronized (thLock) {
                        thCompleted++;
                        sucecssCalls += localSuccess;
                        thLock.notifyAll();
                    }
                }
            }));
        }
        thCompleted = 0;
        sucecssCalls = 0;
        long start = System.currentTimeMillis();
        for (Thread t : thList) {
            t.start();
        }
        while (thCompleted < multipleThreads && (System.currentTimeMillis() - start < 10_000)) {
            synchronized (thLock) {
                try {
                    thLock.wait(1000);
                } catch (InterruptedException ex) {
                }
            }
        }
        long end = System.currentTimeMillis();
        result = "test multiThread Total success cals: " + sucecssCalls + "/" + multipleCalls + " TotalNetworkTrafic: "
                + ((dataSizeInKb * sucecssCalls) / 1024d) + "Mb"
                + " return in: " + (end - start) + "ms";
    }

    public void testNoReturn() {
        try {
            long start = System.currentTimeMillis();
            iFace.jcTestNoReturn();
            long end = System.currentTimeMillis();
            result = "test no return in: " + (end - start) + "ms";
        } catch (Exception e) {
            result = "testNoReturn Exception: " + e.getMessage();
        }
    }

    public void testDelayReturn() {
        try {
            long start = System.currentTimeMillis();
            iFace.jcTestDelayedResponse(delay_ms);
            long end = System.currentTimeMillis();
            result = "test delay return in: " + (end - start) + "ms";
        } catch (Exception e) {
            result = "testNoReturn Exception: " + e.getMessage();
        }
    }

    public void testLargeDataReturn() {
        try {
            long start = System.currentTimeMillis();
            iFace.jcTestReturnLargeData();
            long end = System.currentTimeMillis();
            result = "test delay return in: " + (end - start) + "ms";
        } catch (Exception e) {
            result = "testNoReturn Exception: " + e.getMessage();
        }
    }

    public void testLargeDataSendAndReturn() {
        try {
            byte b[] = new byte[dataSizeInKb * 1024];
            long start = System.currentTimeMillis();
            Object jcTestReturnSame = iFace.jcTestReturnSame(b);
            long end = System.currentTimeMillis();
            result = "Test Both Ways Data return:" + jcTestReturnSame + " in: " + (end - start) + "ms";
        } catch (Exception e) {
            result = "testNoReturn Exception: " + e.getMessage();
        }
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

    public int getDataSizeInKb() {
        return dataSizeInKb;
    }

    public void setDataSizeInKb(int dataSizeInKb) {
        this.dataSizeInKb = dataSizeInKb;
    }

    public String getFilter() {
        return filter;
    }

    public void setFilter(String filter) {
        this.filter = filter;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public List<JcConnectionMetrics> getAllMetrics() {
        List<JcConnectionMetrics> list = new ArrayList<>();
        for (Map.Entry<String, List<JcConnectionMetrics>> entry : allMetrics.entrySet()) {
            list.addAll(entry.getValue());
        }
        return list;
    }

    public int getDelay_ms() {
        return delay_ms;
    }

    public void setDelay_ms(int delay_ms) {
        this.delay_ms = delay_ms;
    }

    public String getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }

    public int getMultipleCalls() {
        return multipleCalls;
    }

    public void setMultipleCalls(int multipleCalls) {
        this.multipleCalls = multipleCalls;
    }

    public int getMultipleThreads() {
        return multipleThreads;
    }

    public void setMultipleThreads(int multipleThreads) {
        this.multipleThreads = multipleThreads;
    }

}
