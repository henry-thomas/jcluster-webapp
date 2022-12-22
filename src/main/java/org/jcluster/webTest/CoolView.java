/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.jcluster.webTest;

import java.io.Serializable;
import java.util.logging.Logger;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;
import org.jcluster.core.bean.JcAppDescriptor;
import org.jcluster.core.bean.JcAppInstanceData;
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
    private JcAppInstanceData appData;
    private JcAppDescriptor appDescriptor;
    private int delay_ms = 1000;

    private Object largeDataResult;

    private long timeTaken = 0l;
    private String result;

    @Inject
    JcTestRemoteInterface iFace;

    @PostConstruct
    public void init() {
        appData = JcAppInstanceData.getInstance();
        inboundMetrics = appData.getInboundMetrics();
        outboundMetrics = appData.getOutboundMetrics();
        appDescriptor = JcFactory.getManager().getAppDescriptor();
//        test();
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

    public void stopSocket() {
        JcFactory.getManager().socketStopTest();
    }

    public void testFilterAndReturn() {
        try {

            result = iFace.jcTestFilterAndReturn("Pieter").getSurname();
        } catch (Exception e) {
            result = "Exception: " + e.getMessage();
        }

    }

    public void testThrowException() {
        try {

            iFace.jcTestThrowException(new Exception("Test Random Exception"));
            result = "TestException FAIL!";
        } catch (Exception e) {
            result = "Exception: " + e.getMessage();
        }

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

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public List<JcConnectionMetrics> getInboundMetrics() {
        return inboundMetrics;
    }

    public List<JcConnectionMetrics> getOutboundMetrics() {
        return outboundMetrics;
    }

    public JcAppInstanceData getAppData() {
        return appData;
    }

    public int getDelay_ms() {
        return delay_ms;
    }

    public void setDelay_ms(int delay_ms) {
        this.delay_ms = delay_ms;
    }

}
