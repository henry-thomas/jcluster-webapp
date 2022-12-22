/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.jcluster.webTest;

import java.util.logging.Logger;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.jcluster.core.cluster.JcFactory;

/**
 *
 * @author henry
 */
public class LifecycleListener implements ServletContextListener {

    private static final Logger LOG = Logger.getLogger(LifecycleListener.class.getName());

    @Override
    public void contextInitialized(ServletContextEvent contextEvent) {
        LOG.info("LifecycleListener: contextInitialized()");
        JcFactory.initManager();
    }

    @Override
    public void contextDestroyed(ServletContextEvent contextEvent) {
        LOG.info("LifecycleListener: contextDestroyed()");
        JcFactory.getManager().destroy();
    }
}
