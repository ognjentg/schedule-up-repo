var meetingView = {
    roomId:null,

    addMeetingDialog: {
        view: "popup",
        id: "addMeetingDialog",
        modal: true,
        position: "center",
        body: {
            id: "addMeetingInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa fa-calendar_alt'></span> Rezervacija sale",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('addMeetingDialog');"
                }]
            }, {
                view: "form",
                id: "addMeetingForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [

                    {
                        view: "text",
                        id: "topic",
                        name: "topic",
                        label: "Tema:",
                        invalidMessage: "Unesite temu!",
                        required: true
                    },{
                        view: "text",
                        id: "description",
                        name: "description",
                        label: "Opis:",
                        invalidMessage: "Unesite opis!",
                        required: true
                    },{
                        view:"datepicker",
                        format:"%d-%m-%Y %H:%i",
                        timepicker: true,
                        id: "startTime",
                        name: "startTime",
                        label: "Vrijeme početka:",
                        invalidMessage: "Unesite vrijeme početka!",
                        required: true
                    },
                    {
                        view: "datepicker",
                        format:"%d-%m-%Y %H:%i",
                        timepicker: true,
                        id: "endTime",
                        name: "endTime",
                        label: "Vrijeme završetka:",
                        invalidMessage: "Unesite vrijeme završetka!",
                        required: true
                    },{ view:"uploader",
                        id:"uploader_1",
                        value:"Dodajte dokument",
                        link:"mylist",
                        on:{
                            onBeforeFileAdd: function(upload){
                                var file = upload.file;
                                var reader = new FileReader();
                                reader.onload = function(event) {
                                    var form = $$("addMeetingForm");
                                   // form.elements.uploader_1.setValue(event.target.result.split("base64,")[1]);

                                };
                                reader.readAsDataURL(file);
                                return false;
                            }
                        }

                    },{
                        view:"list",  id:"mylist", type:"uploader",
                        autoheight:true, borderless:true
                    },
                    { view: "label",
                        id: "label",
                        label: "Dodajte učesnike:"},

                    { view: "text",
                        id: "email",
                        name:"email",
                        label: "E-mail nezaposlenih u kompaniji:",
                    },
                    {view: "activeList",
                        id:"mylist",
                        container:"testA",
                        width:650,
                        autoheight:true,
                        select:true,
                        scroll:"x",
                        data:[
                            { id:1, title:"The Shawshank Redemption", year:1994, rank:1, markCheckbox:1},
                            { id:2, title:"The Godfather", year:1972,  rank:2, markCheckbox:0},
                            { id:3, title:"The Godfather: Part II", year:1974, rank:3},
                            { id:4, title:"The Good, the Bad and the Ugly", year:1966, rank:4, markCheckbox:1},
                            { id:5, title:"My Fair Lady", year:1964, rank:5, markCheckbox:1},
                            { id:6, title:"12 Angry Men", year:1957, rank:6, markCheckbox:0}
                        ],
                        activeContent:{

                            markCheckbox:{
                                view:"checkbox",
                                width:50,
                                on:{ /*checkbox onChange handler*/
                                    'onChange':function(newv, oldv){
                                        var item_id = this.config.$masterId;
                                        var state = this.getValue()?"Check ":"Uncheck ";
                                        webix.message(state+item_id);
                                    }
                                }
                            }
                        }
                        },
                    {
                        margin: 5,
                        cols: [{}, {
                            id: "saveMeeting",
                            view: "button",
                            value: "Dodajte sastanak",
                            type: "form",
                            click: "meetingView.saveMeeting",
                            hotkey: "enter",
                            width: 150
                        }]
                    }
                ]
            }]
        }
    },
    panel: {
        id: "meetingPanel",
        adjust: true,
        rows: [{
            view: "template",
            template: "<div id='scheduler_there' class='dhx_cal_container' style='width:100%; height:100%;'><div class='dhx_cal_navline'><div class='dhx_cal_prev_button'>&nbsp;</div><div class='dhx_cal_next_button'>&nbsp;</div><div class='dhx_cal_today_button'></div><div class='dhx_cal_date'></div></div><div class='dhx_cal_header'></div><div class='dhx_cal_data'></div></div>",
        }
        ]
    },

    selectPanel: function (room) {
        detachAllEvents();

        scheduler.attachEvent("onContextMenu", function(event_id, native_event_object) {
            if (event_id) {
                var posx = 0;
                var posy = 0;
                if (native_event_object.pageX || native_event_object.pageY) {
                    posx = native_event_object.pageX;
                    posy = native_event_object.pageY;
                } else if (native_event_object.clientX || native_event_object.clientY) {
                    posx = native_event_object.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    posy = native_event_object.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }
                menu.showContextMenu(posx, posy);
                return false; // prevent default action and propagation
            }
            return true;
        });
        webix.protoUI({
            name:"activeList"
        },webix.ui.list,webix.ActiveContent);
        $$("main").removeView(rightPanel);
        meetingView.roomId=room;
        rightPanel = "meetingPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));

        scheduler.clearAll();
        var event=scheduler.attachEvent("onEmptyClick",function(date,e){
            webix.ui(webix.copy(meetingView.addMeetingDialog)).show();
            $$("startTime").setValue(date);

        });
        schedulerEvents.push(event);
        scheduler.config.xml_date = "%d-%m-%Y %H:%i";
        scheduler.config.readonly = true;
        scheduler.config.first_hour=parseInt(companyData.timeFrom.substr(0,2));

        scheduler.init('scheduler_there', new Date(), "week");
        schedulerEvents.push(scheduler.attachEvent("onEventLoading", function(ev){
            if (ev.status!==0)
                ev.color="#bdd5ff";
            return true;
        }));
        //alert(room.id);
        scheduler.load("meeting/getByRoom/"+room.id, "json");

    },
    saveMeeting:function(){
        var form = $$("addMeetingForm");
        var formatter=webix.Date.dateToStr("%d-%m-%Y %H:%i");
        var today=new Date();
        if(Date.parse(form.getValues().startTime)<Date.now()) {
            util.messages.showErrorMessage("Nije moguće napraviti odabrati datum koji je prošao.");
            return;
        }
        console.log(formatter(form.getValues().startTime));
        if (form.validate()) {
            var newMeeting = {
                start_date:formatter(form.getValues().startTime),
                end_date: formatter(form.getValues().endTime),
                description:form.getValues().description,
                text:form.getValues().topic,
                participantsNumber:0,
                status:0,
                companyId:companyData.id,
                userId:userData.id,
                roomId:meetingView.roomId.id

            };
            var pro=webix.ajax().headers({
                "Content-type":"application/json"
            }).post("meeting",newMeeting).then(function(realData){
                util.messages.showMessage( realData.text());

            });
            pro.fail(function(err){
                console.log(err);
                util.messages.showErrorMessage(err.message)});
            webix.ajax("someA.php").then(function(realdataA){
                return webix.ajax("someB.php");
            }).then(function(realdataB){
                return webix.ajax("someC.php")
            }).then(function(realdataC){

            });
            util.dismissDialog('addMeetingDialog');
        }
    }

};