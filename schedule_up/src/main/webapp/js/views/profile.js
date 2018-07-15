var profileView={
    change:0,
    panel: {
        id: "profilePanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                template: "<span class='fa fa-user'></span> Profil"
            },{}, {
                id: "editUserButton",
                view: "button",
                type: "iconButton",
                alignment:'right',
                label: "Izmjena",
                click: "profileView.changeProfile",
                icon: "id-badge",
                inputWidth:100

            }]
        }, {
            cols: [{"view": "template",
                borderless:true,
                width: 200,
                height: 200,
                "template": "<p></p>"},{rows:[{"view": "template",
                    borderless:true,
                    height: 50,
                    "template": "<p>Korisnička slika</p>"},
                    {
                        "view": "template",
                        borderless:true,
                        id: "photo",
                        name: "photo",
                        width: 200,
                        height: 200,
                        "template": "<img src='#src#' class='photo-alignment'/>",
                        onClick:{
                            "photo-alignment":function(e, id, trg){
                                if(profileView.change==1) {
                                    $$("tmpUser").show();
                                    var source = $$("photo").getValues()['src'];
                                    $$("tmp").setValues({src: source});
                                    return false; // here it blocks the default behavior
                                }
                            }
                        },},{}
                ]
            },{"view": "template",
                borderless:true,
                width: 50,
                "template": "<p></p>"}
                ,
                {
                    view: "form",
                    borderless:true,
                    width:x,
                    height:y,
                    id: "profileForm",
                    elementsConfig: {
                        bottomPadding: 20
                    },
                    elements: [{
                        view: "text",
                        width:400,
                        align:"left",
                        id: "username",
                        name: "username",
                        readonly:true,
                        label: "Korisničko ime:",
                        labelWidth:118,
                        labelAlign:'left',
                        invalidMessage: "Unesite korisničko ime!",
                        //required: true
                    },{
                        view: "text",
                        name: "base64ImageUser",
                        hidden: true
                    },
                        {view: "text",
                            id: "firstname",
                            name: "firstName",
                            width:400,
                            align:"left",
                            label: "Ime:",
                            readonly:true,

                            invalidMessage: "Unesite ime!",
                            labelAlign:'right',
                            //required: true
                        },
                        {view: "text",
                            id: "lastname",
                            name: "lastName",
                            width:400,
                            align:"left",
                            label: "Prezime:",
                            readonly:true,
                            editaction:"dblclick",
                            invalidMessage: "Unesite prezime!",
                            labelAlign:'right',
                            // required: true
                        },
                        {
                            view: "text",
                            id: "email",
                            name: "email",
                            width:400,
                            align:"left",
                            label: "E-mail:",
                            readonly:true,
                            invalidMessage: "Unesite prezime!",
                            labelAlign:'right',
                            // required: true
                        },{
                            cols:[
                                {width:150},
                                {
                                    margin:5,
                                    id: "saveProfile",
                                    view: "button",
                                    align:"right",
                                    value: "Sačuvajte",
                                    type: "form",
                                    click: "profileView.saveChanges",
                                    hotkey: "enter",
                                    width:200,
                                    hidden:true

                                },{
                                    width:500
                                }

                            ]}],
                    rules: {

                        "firstName": function (value) {
                            if (!value)
                            {return false;}
                            if (value.length > 100) {
                                $$('profileForm').elements.firstname.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                                return false;
                            }
                            return true;
                        },
                        "lastName": function (value) {
                            if (!value)
                            {return false;}
                            if (value.length > 100) {
                                $$('profileForm').elements.lastname.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                                return false;
                            }
                            return true;
                        },

                    }}]}]
    },
    changeProfile:function(){
        profileView.change=1;
        $$("profileForm").elements["firstName"].config.readonly = false;
        $$("profileForm").elements["firstName"].config.required = true;
        $$("profileForm").elements["firstName"].refresh();
        $$("profileForm").elements["lastName"].config.readonly = false;
        $$("profileForm").elements["lastName"].config.required = true;
        $$("profileForm").elements["lastName"].refresh();
        $$("saveProfile").show();
    },
    saveChanges:function() {
        if ($$("profileForm").validate()) {

            var helpUser = userData;
            helpUser.firstName = $$("profileForm").getValues().firstName;
            helpUser.lastName = $$("profileForm").getValues().lastName;
            helpUser.photo = $$("photo").getValues()['src'].split("base64,")[1];

            connection.sendAjax("PUT", "user/" + helpUser.id,
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Podaci su uspješno izmijenjeni.");
                        userData = helpUser;
                        profileView.change = 0;
                        $$("profileForm").elements["firstName"].config.readonly = true;
                        $$("profileForm").elements["firstName"].config.required = false;
                        $$("profileForm").elements["firstName"].refresh();
                        $$("profileForm").elements["lastName"].config.readonly = true;
                        $$("profileForm").elements["lastName"].config.required = false;
                        $$("profileForm").elements["lastName"].refresh();
                        $$("saveProfile").hide();

                    } else
                        util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, function () {
                    util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, helpUser);
        }
    },
    selectPanel: function(){
        $$("main").removeView(rightPanel);
        rightPanel = "profilePanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        $$("profileForm").load("user/"+userData.id);
        $$("photo").setValues({src:"data:image/png;base64,"+userData.photo});


    },
    hide:function(){
        $$("tmpUser").hide();
    }

};
webix.ui({
    view:"popup",
    id:"tmpUser",
    position:"center",
    close:true,
    body:{
        rows: [{
            view: "toolbar",
            cols: [{
                view: "label",
                label: "<span class='webix_icon fa fa-image'></span> Korisnička slika",
                width: 400
            }, {}, {
                hotkey: 'esc',
                view: "icon",
                icon: "close",
                align: "right",
                click: "profileView.hide",
            }]
        }, {
            id:"tmp",
            view:"template",
            template:"<img src='#src#' style='width: 100%;height: 100%; max-width:100%; alignment: center; max-height:100%'></img>",
            width:500,
            autoheight:true
        },
            {
                view:"uploader",
                value:"Izmjena fotografije",
                accept:"image/jpeg, image/png",
                autosend:false,
                width:200,
                align:"center",
                multiple:false,
                on:{
                    onBeforeFileAdd: function(upload){
                        var file = upload.file;
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            $$("photo").setValues({src:event.target.result});
                            $$("tmp").setValues({src:event.target.result});
                            //var form = $$("registrationForm");
                            //  form.elements.base64ImageUser.setValue(event.target.result.split("base64,")[1]);
                        };
                        reader.readAsDataURL(file)
                        return false;
                    }
                }
            }
        ]}
})