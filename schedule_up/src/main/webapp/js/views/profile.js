var profileView={
    changeProfileDialog: {
        view: "popup",
        id: "changeProfileDialog",
        modal: true,
        position: "center",
        body: {
            rows: [{
                view: "toolbar",
                padding: 8,
                cols: [{
                    view: "label",
                    label: "<span class='fa fa-user'></span> Profil"
                },{}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('changeProfileDialog');"

                }]
            }, {
                cols: [{"view": "template",
                    borderless:true,
                    width: 30,
                    height: 30,
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
                                    $$("uploadAPI").fileDialog();
                                    return false; // here it blocks the default behavior

                                }
                            },},{}
                    ]
                },{"view": "template",
                    borderless:true,
                    width: 30,
                    "template": "<p></p>"}
                    ,
                    {
                        view: "form",
                        borderless:true,
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
                            labelAlign:'left',
                            labelWidth:118,
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
                                readonly:false,

                                invalidMessage: "Unesite ime!",
                                labelAlign:'left',
                                labelWidth:118,
                                required: true
                            },
                            {view: "text",
                                id: "lastname",
                                name: "lastName",
                                width:400,
                                align:"left",
                                label: "Prezime:",
                                readonly:false,
                                editaction:"dblclick",
                                invalidMessage: "Unesite prezime!",
                                labelAlign:'left',
                                labelWidth:118,
                                required: true
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
                                labelAlign:'left',
                                labelWidth:118

                                // required: true
                            },{
                                cols:[

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
                                        //  hidden:true

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
        }},
    saveChanges:function() {
        if ($$("profileForm").validate()) {

            var helpUser = userData;
            helpUser.firstName = $$("profileForm").getValues().firstName;
            helpUser.lastName = $$("profileForm").getValues().lastName;
            helpUser.photo = $$("photo").getValues()['src'].split("base64,")[1];
            connection.sendAjax("PUT", "user/" + helpUser.id,
                function (text, data, xhr) {
                    if (text) {
                        util.dismissDialog('changeProfileDialog');
                        util.messages.showMessage("Podaci su uspješno izmijenjeni.");
                        userData = helpUser;
                        if(userData.roleId===1)
                        $$("userInfo").setHTML("<p style='display: table-cell;line-height: 13px;height:75px;vertical-align: middle;font-size: 14px;}'>"+userData.firstName+" "+userData.lastName+"<br> super admin</p>");
                        else if(userData.roleId===2)
                            $$("userInfo").setHTML("<p style='display: table-cell;line-height: 13px;vertical-align:text-top;font-size: 14px;}'>"+userData.firstName+" "+userData.lastName+"<br> administrator</p>");
                        else if(userData.roleId===3)
                            $$("userInfo").setHTML("<p style='display: table-cell;line-height: 13px;vertical-align:text-top;font-size: 14px;}'>"+userData.firstName+" "+userData.lastName+"<br> napredni korisnik</p>");
                        else $$("userInfo").setHTML("<p style='display: table-cell;line-height: 13px;vertical-align:text-top;font-size: 14px;}'>"+userData.firstName+" "+userData.lastName+"<br> korisnik</p>");
                    } else
                        util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, function (text, data, xhr) {
                    util.messages.showErrorMessage(text);
                }, helpUser);
        }
    },
    changePasswordDialog: {
        view: "popup",
        id: "changePasswordDialog",
        modal: true,
        position: "center",
        body: {
            id: "changePasswordInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='fa fa-key'></span> Izmjena lozinke",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('changePasswordDialog');"
                }]
            }, {
                view: "form",
                id: "changePasswordForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    type:"password",
                    id: "oldPassword",
                    name: "oldPassword",
                    label: "Lozinka: ",
                    invalidMessage: "Unesite lozinku!",
                    required: true

                },
                    {
                        id: "newPassword1",
                        name: "newPassword1",
                        view: "text",
                        type:"password",
                        label: "Nova lozinka: ",
                        invalidMessage: "Unesite lozinku!",
                        required: true
                    }, {
                        id: "newPassword2",
                        name: "newPassword2",
                        view: "text",
                        type:"password",
                        label: "Potvrdite novu lozinku: ",
                        invalidMessage: "Unesite lozinku!",
                        required: true
                    }, {
                        margin: 5,
                        cols: [{}, {
                            id: "savePassword",
                            view: "button",
                            value: "Sačuvajte",
                            type: "form",
                            click: "profileView.save",
                            hotkey: "enter",
                            width: 150
                        }]
                    }],
                rules: {
                    "oldPassword":function (value) {
                        if (!value)
                            return false;
                        return true;
                    },
                    "newPassword1":function (value) {
                        var re1 = /[0-9]/;
                        var re2 = /[a-z]/;
                        var re3 = /[A-Z]/;
                        var re4=/[@#$%^&+=]/;
                        if (!value)
                            return false;
                        if(value.length<8) {
                            $$('changePasswordForm').elements.newPassword1.config.invalidMessage = 'Lozinka mora da ima više od 8 karaktera!';
                            return false;
                        }
                        if(!re1.test(value)){
                            $$('changePasswordForm').elements.newPassword1.config.invalidMessage = 'Lozinka mora da sadrži bar jedan broj!';
                            return false;
                        }
                        if(!re2.test(value)){
                            $$('changePasswordForm').elements.newPassword1.config.invalidMessage = 'Lozinka mora da sadrži bar jedno malo slovo!';
                            return false;
                        }
                        if(!re3.test(value)){
                            $$('changePasswordForm').elements.newPassword1.config.invalidMessage = 'Lozinka mora da sadrži bar jedno veliko slovo!';
                            return false;
                        }
                        if(!re4.test(value)){
                            $$('changePasswordForm').elements.newPassword1.config.invalidMessage = 'Lozinka mora da sadrži specijalni karakter: (@ # $ % ^ & + =) !';
                            return false;
                        }

                        return true;
                    },
                    "newPassword2":function (value) {
                        if (!value)
                            return false;
                        if(value!=$$("changePasswordForm").getValues().newPassword1)
                        {
                            $$('changePasswordForm').elements.newPassword2.config.invalidMessage = 'Unešene lozinke nisu iste!';
                            return false;}

                        return true;
                    },
                }
            }]
        }
    },


    hide:function(){
        $$("tmpUser").hide();
    }
    ,
    save:function(){
        if ($$("changePasswordForm").validate()) {
            var passwordInformation={
                oldPassword:$$("changePasswordForm").getValues().oldPassword,
                newPassword:$$("changePasswordForm").getValues().newPassword1,
                repeatedNewPassword:$$("changePasswordForm").getValues().newPassword2,
            };

            connection.sendAjax("POST", "user/updatePassword",
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Uspješna izmjena lozinke.");
                    } else
                        util.messages.showErrorMessage("Neuspješna izmjena lozinke.");
                }, function (text, data, xhr) {
                    util.messages.showErrorMessage(text);
                }, passwordInformation);
            util.dismissDialog('changePasswordDialog');


        }
    }
};
webix.ui(
    {
        view:"uploader",
        id:"uploadAPI",
        accept:"image/jpeg, image/png",
        autosend:false,
        width:200,
        apiOnly: true,
        align:"center",
        multiple:false,
        on:{
            onBeforeFileAdd: function(upload){
                var file = upload.file;
                var reader = new FileReader();
                reader.onload = function(event) {
                    $$("photo").setValues({src:event.target.result});

                };
                reader.readAsDataURL(file)
                return false;
            }
        }
    }
)
