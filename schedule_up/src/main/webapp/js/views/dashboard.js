var dashboardView = {
    panel: {
        id: "dashBoardPanel",
        adjust: true,
        rows: [{
                id:"dashboardTimetable",
                view:"template",
                template:"<div id='scheduler_here' class='dhx_cal_container' style='width:100%; height:100%;'><div class='dhx_cal_navline'><div class='dhx_cal_prev_button'>&nbsp;</div><div class='dhx_cal_next_button'>&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div></div><div class='dhx_cal_header'></div><div class='dhx_cal_data'></div></div>",

            }]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "dashboardPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
        scheduler.config.xml_date="%d-%m-%Y %H:%i";
        scheduler.config.server_utc=true;
        scheduler.config.readonly = true;
        scheduler.init('scheduler_here', new Date(),"week");
        scheduler.load("meeting/","json");
    }


};