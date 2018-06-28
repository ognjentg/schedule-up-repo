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
            }, { cols:[
                    { view: "form",
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

                            } ,{
                                view:"list",  id:"mylist", type:"uploader",
                                autoheight:true, borderless:true
                            },

                            { view: "text",
                                id: "email",
                                name:"email",
                                label: "E-mail nezaposlenih u kompaniji:",
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
                    },{rows:[{
                            view: "label",
                            align:"center",
                            label: "<span class='webix_icon fa fa-user'></span> Učesnici",
                            width: 300

                        },{
                            view: "list",
                            id:"userList",
                            width: 300,
                            type: {
                                markCheckbox: function (obj) {
                                    return "<span class='check webix_icon fa-" + (obj.markCheckbox ? "check-" : "") + "square-o'></span>";
                                }
                            },
                            onClick: {
                                "check": function (e, id) {
                                    var item = this.getItem(id);
                                    item.markCheckbox = item.markCheckbox ? 0 : 1;
                                    this.updateItem(id, item);
                                }
                            },
                            template: "#firstName# #lastName#  {common.markCheckbox()}",

                        } ]},{rows:[{
                            view: "label",
                            align:"center",
                            label: "<span class='webix_icon fa fa-users'></span> Korisničke grupe",
                            width: 200

                        },{
                            view: "list",
                            id:"userGroupList",
                            width: 200,
                            type: {
                                markCheckbox: function (obj) {
                                    return "<span class='check webix_icon fa-" + (obj.markCheckbox ? "check-" : "") + "square-o'></span>";
                                }
                            },
                            onClick: {
                                "check": function (e, id) {
                                    var item = this.getItem(id);
                                    item.markCheckbox = item.markCheckbox ? 0 : 1;
                                    this.updateItem(id, item);
                                }
                            },
                            template: "#name#  {common.markCheckbox()}"}] }]
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
            $$("userList").load("user");
            $$("userGroupList").load("user-group");

            $$("userList").attachEvent("onAfterLoad", function(){

                $$("userList").filter(function(obj){
                    return (obj.firstName!=null && obj.id!=userData.id);
                });
            });

            $$("userGroupList").attachEvent("onAfterLoad", function(){

                $$("userGroupList").filter(function(obj){
                    return obj.name!=null;
                });
            });

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
        scheduler.load("meeting/getByRoom/"+room.id, "json");

    },
    saveMeeting:function(){
        var participants=[];
        $$("userList").data.each(function(obj){
                if(obj.markCheckbox==1) {
                    var participant={
                        userId:obj.id,
                        deleted:0,
                        companyId:companyData.id,
                        meetingId:1
                    };
                    participants.push(participant);
                }

            }
        );
        $$("userGroupList").data.each(function(obj){
                if(obj.markCheckbox==1) {
                    var group={
                        userGroupId:obj.id,
                        deleted:0,
                        companyId:companyData.id,
                        meetingId:1
                    };
                    participants.push(group);
                }

            }
        );
        var form = $$("addMeetingForm");
        var formatter=webix.Date.dateToStr("%d-%m-%Y %H:%i");
        var today=new Date();

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
                for(var i=0;i<participants.length;i++){
                    var pom2=realData.json();
                    participants[i].meetingId=realData.json().id;
                }

                connection.sendAjax("POST", "participant/insertAll",
                    function (text, data, xhr) {

                        if (data) {
                            util.messages.showMessage("Uspješno kreirana rezervacija.");

                        } else
                            util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");
                    }, function () {
                        util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");
                    }, participants);

            });
            pro.fail(function(err){
                util.messages.showErrorMessage("Neuspješno kreiranje rezervacije.");});
            util.dismissDialog('addMeetingDialog')

        }
    }

};