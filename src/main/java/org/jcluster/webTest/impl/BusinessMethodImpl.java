/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.jcluster.webTest.impl;

import org.jcluster.webTest.controller.DataInitializer;
import org.jcluster.webTest.controller.entity.Dummy;
import java.util.logging.Logger;
import javax.ejb.Stateless;
import org.jcluster.webTest.interfaces.JcTestRemoteInterface;
import javax.inject.Inject;

/**
 *
 * @author henry
 */
@Stateless
public class BusinessMethodImpl implements JcTestRemoteInterface {

    @Inject
    DataInitializer data;
    private static final Logger LOG = Logger.getLogger(BusinessMethodImpl.class.getName());

    @Override
    public String jcTestBroadcast() {
        return "Success Broadcast";
    }

    @Override
    public String jcTestFilterSingleArg(Object message, String serialNumber) {
//        LOG.log(Level.INFO, "Business Method Called from: {0}", Thread.currentThread().getName());
//            Thread.sleep(2000);
        return "Hello";
    }

    @Override
    public Dummy jcTestFilterAndReturn(String name) {
        return data.getDataMap().get(name);
    }

    @Override
    public Object jcTestReturnLargeData() {
        return data.getBigData();
    }

    @Override
    public void jcTestNoReturn() {
        System.out.println("Call no return Method");
    }

    @Override
    public void jcTestThrowException(Exception e) throws Exception {
        throw e;
    }

    @Override
    public String jcTestDelayedResponse(int delay_ms) {
        try {
            Thread.sleep(delay_ms);
        } catch (InterruptedException ex) {
        }
        return "Business method slept for: " + delay_ms;
    }

    @Override
    public Object jcTestReturnSame(Object obToReturn) {
        return obToReturn;
    }

}
