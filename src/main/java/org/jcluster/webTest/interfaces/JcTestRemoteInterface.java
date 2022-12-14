/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package org.jcluster.webTest.interfaces;

import org.jcluster.webTest.controller.entity.Dummy;
import java.io.Serializable;
import javax.ejb.Remote;
import org.jcluster.lib.annotation.JcBroadcast;
import org.jcluster.lib.annotation.JcFilter;
import org.jcluster.lib.annotation.JcRemote;
import org.jcluster.lib.annotation.JcTimeout;

/**
 *
 * @author henry
 */
@Remote
@JcRemote(appName = "jcTest")
public interface JcTestRemoteInterface extends Serializable {

    @JcBroadcast
    public String jcTestBroadcast();

    public String jcTestFilterSingleArg(Object message, @JcFilter(filterName = "loggerSerial") String serialNumber);

    public Dummy jcTestFilterAndReturn(@JcFilter(filterName = "name") String name);

    public Object jcTestReturnLargeData();

    public void jcTestNoReturn();

    public Object jcTestReturnSame(Object obToReturn);

    public void jcTestThrowException(Exception e) throws Exception;

    @JcTimeout(timeout = 2000)
    public String jcTestDelayedResponse(int delay_ms);

}
