package org.jcluster.webTest.util;

import java.util.List;
import java.util.Map;
import javax.faces.application.FacesMessage;
import org.primefaces.PrimeFaces;
import org.primefaces.model.SortOrder;
import org.primefaces.shaded.json.JSONObject;

public class PfUtil {

    public static final String JS_MES_LEVEL_INFO = "info";
    public static final String JS_MES_LEVEL_WARN = "warn";
    public static final String JS_MES_LEVEL_ERROR = "error";
    public static final String JS_MES_LEVEL_FINE = "fine";
    public static final String JS_MES_LEVEL_FATAL = "fatal";

    public static void displayMessageDialog(FacesMessage.Severity severity, String message) {

//        PrimeFaces.current().executeScript(message); showMessageInDialog(new FacesMessage(FacesMessage.SEVERITY_INFO, message, null));
    }

    public static void displayMessageDialog(FacesMessage.Severity severity, String message, String detail) {
//        PrimeFaces.current().(new FacesMessage(FacesMessage.SEVERITY_INFO, message, detail));
    }

    public static void displayDialog(String dialogWidgetVar, boolean state) {
        if (state) {
            PrimeFaces.current().executeScript("PF('" + dialogWidgetVar + "').show();");
        } else {
            PrimeFaces.current().executeScript("PF('" + dialogWidgetVar + "').hide();");
        }
    }

    public static void executeJS(String jsString) {
        PrimeFaces.current().executeScript(jsString);
    }

    public static void showMessageToClient(String severity, String message, String detail) {
        String[] commandArr = new String[3];
        if (severity != null) {
            commandArr[0] = severity;
        }
        if (message != null) {
            commandArr[1] = message;
        }
        if (detail != null) {
            commandArr[2] = detail;
        }
        PfUtil.executeJSWithParam("mainUtils.showMessage", commandArr);
    }

    public static void showWarningMessageToClient(String message, String detail) {
        PfUtil.showMessageToClient(JS_MES_LEVEL_WARN, message, detail);
    }

    public static void showInfoMessageToClient(String message, String detail) {
        PfUtil.showMessageToClient(JS_MES_LEVEL_INFO, message, detail);
    }

    public static void showErrorMessageToClient(String message, String detail) {
        PfUtil.showMessageToClient(JS_MES_LEVEL_ERROR, message, detail);
    }

    public static void executeJsJsonParamParse(String function, Object param) {
        JSONObject json = new JSONObject(param);
        PrimeFaces.current().executeScript(function + "(" + json + ");");
    }

    public static void executeJs(String function, String param) {
        PrimeFaces.current().executeScript(function + "(" + param + ");");
    }

    public static void executeJs(String function, JSONObject params) {
        PrimeFaces.current().executeScript(function + "(" + params.toString() + ");");
    }

    public static void updateCompLabelValue(String componentID, String value) {
        PfUtil.executeJS("$('[id*=" + componentID + "]')[0].innerHTML = '" + value + "'");
    }

    public static void updateCompInputValue(String componentID, String value) {
        PfUtil.executeJS("$('[id*=" + componentID + "]')[0].value = '" + value + "'");
    }

    public static void executeJSWithParam(String functionName, List<String> param) {
        StringBuilder sb = new StringBuilder();
        sb.append(functionName);
        sb.append('(');
        for (int i = 0; i < param.size(); ++i) {
            sb.append("'");
            sb.append(param.get(i));
            sb.append("'");
            if (i + 1 >= param.size()) {
                continue;
            }
            sb.append(",");
        }
        sb.append(");");
        PfUtil.executeJS(sb.toString());
    }

    public static void executeJSWithParam(String functionName, String[] param) {
        StringBuilder sb = new StringBuilder();
        sb.append(functionName);
        sb.append('(');
        for (int i = 0; i < param.length; ++i) {
            sb.append("'");
            sb.append(param[i]);
            sb.append("'");
            if (i + 1 >= param.length) {
                continue;
            }
            sb.append(",");
        }
        sb.append(");");
        PfUtil.executeJS(sb.toString());
    }

    public static void updateComponent(String component) {
        PrimeFaces.current().ajax().update(component);
    }

    public static void logInfo(String infoMessage) {
        PfUtil.executeJS("PrimeFaces.info('" + infoMessage + "');");
    }

    /**
     * Opens a view in a dynamic dialog.
     *
     * @param outcome the logical outcome used to resolve the navigation case.
     * @param options configuration options for the dialog.
     * @param params parameters to send to the view displayed in the dynamic
     * dialog.
     */
    public static void openDialog(String outcome, Map<String, Object> options, Map<String, List<String>> params) {
        PrimeFaces.current().dialog().openDynamic(outcome, options, params);
    }

    /**
     * Close the current dynamic dialog.
     *
     * @param data optional data to pass back to a dialogReturn event.
     */
    public static void closeDialog(Object data) {
        PrimeFaces.current().dialog().closeDynamic(data);
    }

    /**
     * Add a parameter for ajax oncomplete client side callbacks. Value will be
     * serialized to json. Currently supported values are primitives, POJOs,
     * JSONObject and JSONArray.
     *
     * @param name name of the parameter.
     * @param value value of the parameter.
     */
    public static void addCallbackParam(String name, Object value) {
        PrimeFaces.current().ajax().addCallbackParam(name, value);
    }

    public static String translateOrder(SortOrder sortOrder) {
        switch (sortOrder) {
            case ASCENDING:
                return "ASC";
            case DESCENDING:
                return "DESC";
            default:
                return null;
        }
    }
}
