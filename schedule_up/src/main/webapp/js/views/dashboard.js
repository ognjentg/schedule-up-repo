var dashboardView = {
    panel: {
        id: "dashboardPanel",
        adjust: true,
        rows: [{
            view: "template",
            template: "<div id='scheduler_here' class='dhx_cal_container' style='width:100%; height:100%;'><div class='dhx_cal_navline'><div class='dhx_cal_prev_button'>&nbsp;</div><div class='dhx_cal_next_button'>&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div></div><div class='dhx_cal_header'></div><div class='dhx_cal_data'></div></div>",
        }
        ]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "dashboardPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
        scheduler.config.xml_date = "%d-%m-%Y %H:%i";
        scheduler.config.server_utc = true;
        scheduler.config.readonly = true;
        scheduler.init('scheduler_here', new Date(), "week");
        scheduler.attachEvent("onClick", function (id, e) {
            var event = scheduler.getEvent(id);
            webix.promise.all([webix.ajax("user/" + event.userId), webix.ajax("room/" + event.roomId)]).then(
                function (results) {
                    event.creatorUsername = JSON.parse(results[0].text()).username;
                   event.roomName = JSON.parse(results[1].text()).name;
                    dashboardView.showEventPopup(event);
                }
            );
        });
        scheduler.load("meeting/", "json");

    },
    eventDialog: {
        view: "popup",
        id: "eventDialog",
        modal: true,
        position: "center",
        body: {
            id: "eventInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-bookmark'></span> Rezervacija",
                    width: 400
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('eventDialog');"
                }]
            },
                {
                    cols:[
                        {view:"label",width:200, label:"Naziv"},
                        {id:"lblMeetingName",view:"label",width:400,label:"Placeholder"}
                    ]
                }
            ]
        }


    },


    showEventPopup: function (event) {
        webix.ui(webix.copy(dashboardView.eventDialog));
        $$("lblMeetingName").data.label=event.text;

        $$("eventDialog").show();
    }


};