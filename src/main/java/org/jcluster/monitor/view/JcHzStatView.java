/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.jcluster.monitor.view;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hazelcast.map.IMap;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.RequestScoped;
import javax.faces.view.ViewScoped;
import javax.inject.Named;
import org.jcluster.core.JcFactory;
import org.jcluster.core.bean.JcAppDescriptor;
import org.jcluster.monitor.entity.JcFilterEntity;
import org.jcluster.webTest.util.PfUtil;
import org.primefaces.shaded.json.JSONObject;

/**
 *
 * @author henry
 */
@ViewScoped
@Named
public class JcHzStatView implements Serializable{

    List<JcFilterEntity> allFilterList = new ArrayList<>();

    public void getHzFilterStats() {
        allFilterList.clear();
        IMap<String, JcAppDescriptor> hzAppDescMap = JcFactory.getManager().getHzAppDescMap();
        for (Map.Entry<String, JcAppDescriptor> entry : hzAppDescMap.entrySet()) {
            String instanceId = entry.getKey();
            JcAppDescriptor desc = entry.getValue();

            Map<String, HashSet<Object>> filterMap = desc.getFilterMap();
            for (Map.Entry<String, HashSet<Object>> entry1 : filterMap.entrySet()) {
                String filterName = entry1.getKey();
                HashSet<Object> filterList = entry1.getValue();

                for (Object object : filterList) {
                    JcFilterEntity jcFilterEntity = new JcFilterEntity();
                    jcFilterEntity.setServerName(desc.getServerName());
                    jcFilterEntity.setAppName(desc.getAppName());
                    jcFilterEntity.setInstanceId(instanceId);
                    jcFilterEntity.setFilterName(filterName);
                    if (object instanceof String) {
                        jcFilterEntity.setFilterValue((String) object);
                    } else {
                        jcFilterEntity.setFilterValue("Object");
                    }
                    allFilterList.add(jcFilterEntity);
                }
            }

        }

        JSONObject response = new JSONObject(allFilterList);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            PfUtil.executeJs("jcFilterManager.updateFilters", objectMapper.writeValueAsString(allFilterList));
        } catch (JsonProcessingException ex) {
            Logger.getLogger(JcHzStatView.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public List<JcFilterEntity> getAllFilterList() {
        return allFilterList;
    }

}
