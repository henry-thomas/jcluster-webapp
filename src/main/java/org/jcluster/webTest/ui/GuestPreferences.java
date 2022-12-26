/*
 * Copyright 2009-2014 PrimeTek.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jcluster.webTest.ui;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import javax.annotation.PostConstruct;
import javax.enterprise.context.SessionScoped;
import javax.inject.Named;

@Named
@SessionScoped
public class GuestPreferences implements Serializable {

    private static final long serialVersionUID = 3548634277745415466L;

    private Map<String, String> themeColors;

    private String theme = "blue-grey";

    private String menuClass = null;

    private String profileMode = "inline";

    private String menuLayout = "static";

    private boolean compactMode = true;

    private boolean orientationRTL = false;
    private boolean ripple = false;

    private String inputStyle;

    private List<ComponentTheme> componentThemes = new ArrayList<ComponentTheme>();

    @PostConstruct
    public void init() {
        themeColors = new HashMap<>();
        themeColors.put("indigo", "#3F51B5");
        themeColors.put("blue", "#03A9F4");
        themeColors.put("blue-grey", "#607D8B");
        themeColors.put("brown", "#795548");
        themeColors.put("cyan", "#00bcd4");
        themeColors.put("green", "#4CAF50");
        themeColors.put("purple-amber", "#673AB7");
        themeColors.put("purple-cyan", "#673AB7");
        themeColors.put("teal", "#009688");

    }

    public void loadConfig() {
        theme = "blue-grey";
        menuClass = "layout-menu-dark";// sessionBean.getConfigOrCreate("user_theme_", "blue-grey", "Theme");

        profileMode = "inline";
        menuLayout =  "static";
        ripple = true;

        compactMode = true;
        orientationRTL = false;

        this.inputStyle = "overlay";

        componentThemes.clear();
        componentThemes.add(new ComponentTheme("Indigo Pink", "indigo", "indigo-pink.svg"));
        componentThemes.add(new ComponentTheme("Blue Amber", "blue", "blue-amber.svg"));
        componentThemes.add(new ComponentTheme("Blue Grey Green", "blue-grey", "bluegrey-green.svg"));
        componentThemes.add(new ComponentTheme("Brown Green", "brown", "brown-green.svg"));
        componentThemes.add(new ComponentTheme("Cyan Amber", "cyan", "cyan-amber.svg"));
        componentThemes.add(new ComponentTheme("Dark Blue", "dark-blue", "dark-blue.svg"));
        componentThemes.add(new ComponentTheme("Dark Green", "dark-green", "dark-green.svg"));
        componentThemes.add(new ComponentTheme("Grren Yellow", "green", "green-yellow.svg"));
        componentThemes.add(new ComponentTheme("Greey Deep Orange", "grey", "grey-deeporange.svg"));
        componentThemes.add(new ComponentTheme("Purple Amber", "purple-amber", "purple-amber.svg"));
        componentThemes.add(new ComponentTheme("Purple Cyan", "purple-cyan", "purple-cyan.svg"));
        componentThemes.add(new ComponentTheme("Teal Lime", "teal", "teal-lime.svg"));

    }

    public List<ComponentTheme> getComponentThemes() {
        return componentThemes;
    }

    public void setComponentThemes(List<ComponentTheme> componentThemes) {
        this.componentThemes = componentThemes;
    }

    public String getMenuClass() {
        return this.menuClass;
    }

    public String getProfileMode() {
        return this.profileMode;
    }

    public String getTheme() {
        return theme;
    }

    public String getMenuLayoutClass() {
        if (this.menuLayout.equals("static")) {
            return "menu-layout-static";
        } else if (this.menuLayout.equals("overlay")) {
            return "menu-layout-overlay";
        } else if (this.menuLayout.equals("horizontal")) {
            this.profileMode = "overlay";
            return "menu-layout-static menu-layout-horizontal";
        } else if (this.menuLayout.equals("slim")) {
            return "menu-layout-static layout-menu-slim";
        } else {
            return "menu-layout-static";
        }
    }

    public String getMenuLayout() {
//        switch (this.menuLayout) {
//            case "static":
//                return "menu-layout-static";
//            case "overlay":
//                return "menu-layout-overlay";
//            case "horizontal":
//                return "menu-layout-static menu-layout-horizontal";
//            default:
//                return "menu-layout-static";
//        }
//        if (this.menuLayout.equals("static")) {
//            return "menu-layout-static";
//        } else if (this.menuLayout.equals("overlay")) {
//            return "menu-layout-overlay";
//        } else if (this.menuLayout.equals("horizontal")) {
//            this.profileMode = "overlay";
//            return "menu-layout-static menu-layout-horizontal";
//        } else if (this.menuLayout.equals("slim")) {
//            return "menu-layout-static layout-menu-slim";
//        } else {
//            return "menu-layout-static";
//        }
        return this.menuLayout;
    }

    public void setMenuLayout(String menuLayout) {
        if (!Objects.equals(this.menuLayout, menuLayout)) {
            this.menuLayout = menuLayout;

        }
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public void setLightMenu() {
        this.menuClass = null;
    }

    public boolean isRipple() {
        return ripple;
    }

    public void setRipple(boolean ripple) {
        this.ripple = ripple;
    }

    public String getInputStyleClass() {
        return this.inputStyle.equals("filled") ? "ui-input-filled" : "";
    }

    public String getInputStyle() {
        return inputStyle;
    }

    public void setInputStyle(String inputStyle) {
        this.inputStyle = inputStyle;
    }

    public String getDarkMenu() {
        return String.valueOf(this.menuClass.equals("layout-menu-dark"));
    }

    public void setDarkMenu(String darkMenu) {
        this.menuClass = Boolean.parseBoolean(darkMenu) ? "layout-menu-dark" : "layout-menu-light";
//        this.menuClass = darkMenu;
    }

    public void setProfileMode(String profileMode) {
        this.profileMode = profileMode;
    }

    public Map getThemeColors() {
        return this.themeColors;
    }

    public boolean isCompactMode() {
        return compactMode;
    }

    public void setCompactMode(boolean compactMode) {
        this.compactMode = compactMode;
    }

    public boolean isOrientationRTL() {
        return orientationRTL;
    }

    public void setOrientationRTL(boolean orientationRTL) {
        this.orientationRTL = orientationRTL;
    }

    public class ComponentTheme {

        String name;
        String file;
        String image;

        public ComponentTheme(String name, String file, String image) {
            this.name = name;
            this.file = file;
            this.image = image;
        }

        public String getName() {
            return this.name;
        }

        public String getFile() {
            return this.file;
        }

        public String getImage() {
            return this.image;
        }
    }
}
