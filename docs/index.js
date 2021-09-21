define(function(require, exports, module) {
    /* globals $ SEA GUN */

    function hex_encode(byteArray) {
        return Array.prototype.map.call(byteArray, function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }

    function hex_decode(hexString) {
        var result = [];
        for (var i = 0; i < hexString.length; i += 2) {
            result.push(parseInt(hexString.substr(i, 2), 16));
        }
        return Uint8Array.from(result);
    }


    module.exports = {
        start: function(testType) {

            console.log("onlykeyIndex");
            require("./dist/onlykey3rd-party.js")(function(ONLYKEY) {


                var onlykey;
                var pageLayout;
                var keyType;

                var press_required = (testType.split("-")[1] ? true : false);

                if (testType.split("-")[0] == "P256R1") {

                    keyType = 1; //P256R1

                    onlykey = ONLYKEY();

                    onlykey.on("status", function() {
                        var args = [];
                        for (var i = 0; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        var s = args.join(" ");
                        $("#console_output").append($("<span/>").text(s));
                        $("#console_output").append($("<br/>"));
                        $("#connection_status").text(s);
                    });

                    pageLayout = $(require("text!./pageLayout_P256R1.html"));

                    $("#main-container").html(pageLayout);
                    
                    $("#connect_onlykey").click(function() {
                        onlykey.connect(async function() {
                            console.log("onlykey has connected");
                            pageLayout.find("#connect_onlykey").hide();
                            pageLayout.find("#connected_onlykey").show();

                            // pageLayout.find("#derive_public_key").click();
                        });
                    });

                    $("#derive_public_key").click(function() {
                        var AdditionalData = $("#onlykey_additional_data").val();
                        onlykey.derive_public_key(AdditionalData, keyType, press_required, async function(err, ok_jwk_epub) {
                            if (err) console.log(err);
                            pageLayout.find("#onlykey_pubkey").val(ok_jwk_epub);

                            if ($("#encryptKey").val() == "")
                                $("#encryptKey").val(ok_jwk_epub);

                            if ($("#decryptKey").val() == "")
                                $("#decryptKey").val(ok_jwk_epub);


                            pageLayout.find("#encryptData").val("test");
                            //$("#encryptBTN").click();


                        });
                    });

                    $("#encryptBTN").click(async function() {

                        var encData = pageLayout.find("#encryptData").val();
                        var input_jwk_epub = pageLayout.find("#encryptKey").val(); //.split("")
                        //onlykey.b642bytes()

                        var AdditionalData = $("#onlykey_additional_data").val();
                        onlykey.derive_shared_secret(AdditionalData, input_jwk_epub, keyType, press_required, async function(err, sharedSecret, ok_jwk_epub) {
                            if (err) console.log(err);
                            var enc = await GUN.SEA.encrypt(encData, sharedSecret);

                            //pageLayout.find("#encryptData").val(enc);
                            pageLayout.find("#decryptData").val(enc);
                            pageLayout.find("#pills-decrypt-tab").click();
                        });


                    });

                    $("#decryptBTN").click(async function() {

                        var decData = pageLayout.find("#decryptData").val();
                        var input_jwk_epub = pageLayout.find("#decryptKey").val();

                        var AdditionalData = $("#onlykey_additional_data").val();
                        onlykey.derive_shared_secret(AdditionalData, input_jwk_epub, keyType, press_required, async function(err, sharedSecret, ok_jwk_epub) {
                            if (err) console.log(err);
                            //var enc = await SEA.encrypt('shared data', await SEA.secret(bob.epub, alice));

                            var dec = await GUN.SEA.decrypt(decData, sharedSecret);

                            pageLayout.find("#encryptData").val(dec);
                            pageLayout.find("#pills-encrypt-tab").click();
                        });


                    });

                    $("#derive_shared_secrets").click(async function() {

                        (async function() {
                            // var key = pageLayout.find("#onlykey_pubkey").val();

                            var AdditionalData = $("#onlykey_additional_data").val();
                            onlykey.derive_shared_secret(AdditionalData, JSON.parse($("#sea_test_key").val()).epub, keyType, press_required, async function(err, sharedSecret, ok_jwk_epub) {
                                if (err) console.log(err);
                                $("#ok_test_shared_secret").val(sharedSecret);
                                
                                pageLayout.find("#onlykey_pubkey").val(ok_jwk_epub);
                                if ($("#encryptKey").val() == "")
                                $("#encryptKey").val(ok_jwk_epub);

                                if ($("#decryptKey").val() == "")
                                    $("#decryptKey").val(ok_jwk_epub);
                                    
                                var testSharedSecret = await SEA.secret({
                                    epub: ok_jwk_epub
                                }, JSON.parse($("#sea_test_key").val()));
                                
                                $("#sea_test_shared_secret").val(testSharedSecret);

                            });

                        })();

                    });
                    
                    $("#connect_onlykey").click();

                    // (async function() {
                    //     $("#sea_test_key").text(JSON.stringify(await GUN.SEA.pair()))
                    // })()
                }

                /*  
                if (testType == "NACL.js") {
                    require("./test_nacl.js").start(testType)
                }*/

                if (testType.split("-")[0] == "CURVE25519") {
                    keyType = 3; //CURVE25519

                    onlykey = ONLYKEY();

                    onlykey.on("status", function() {
                        var args = [];
                        for (var i = 0; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        var s = args.join(" ");
                        $("#console_output").append($("<span/>").text(s));
                        $("#console_output").append($("<br/>"));
                        $("#connection_status").text(s);
                    });
                    
                    pageLayout = $(require("text!./pageLayout_CURVE25519.html"));

                    $("#main-container").html(pageLayout);

                    $("#connect_onlykey").click(function() {
                        onlykey.connect(async function() {
                            console.log("onlykey has connected");
                            pageLayout.find("#connect_onlykey").hide();
                            pageLayout.find("#connected_onlykey").show();

                            // pageLayout.find("#derive_public_key").click();
                        });
                    });

                    $("#derive_public_key").click(function() {
                        var AdditionalData = $("#onlykey_additional_data").val();
                        onlykey.derive_public_key(AdditionalData, keyType, press_required, async function(err, OK_sharedPubKey, keyString) {
                            if (err) console.log(err);
                            pageLayout.find("#onlykey_pubkey").val(OK_sharedPubKey);

                            if ($("#encryptKey").val() == "")
                                $("#encryptKey").val(OK_sharedPubKey);

                            if ($("#decryptKey").val() == "")
                                $("#decryptKey").val(OK_sharedPubKey);


                            pageLayout.find("#encryptData").val("test");
                            //$("#encryptBTN").click();

                        });
                    });

                    $("#encryptBTN").click(async function() {

                        var encData = pageLayout.find("#encryptData").val();
                        var encryptoToKey = pageLayout.find("#encryptKey").val(); //.split("")
                        //onlykey.b642bytes()
                        var AdditionalData = $("#onlykey_additional_data").val();
                        onlykey.derive_shared_secret(AdditionalData, encryptoToKey, keyType, press_required, async function(err, sharedSecret) {
                            if (err) console.log(err);
                            var enc = await GUN.SEA.encrypt(encData, sharedSecret);

                            //pageLayout.find("#encryptData").val(enc);
                            pageLayout.find("#decryptData").val(enc);
                            pageLayout.find("#pills-decrypt-tab").click();
                        });


                    });

                    $("#decryptBTN").click(async function() {

                        var decData = pageLayout.find("#decryptData").val();
                        var decryptoToKey = pageLayout.find("#decryptKey").val();
                        var AdditionalData = $("#onlykey_additional_data").val();
                        onlykey.derive_shared_secret(AdditionalData, decryptoToKey, keyType, press_required, async function(err, sharedSecret) {
                            if (err) console.log(err);
                            //var enc = await SEA.encrypt('shared data', await SEA.secret(bob.epub, alice));

                            var dec = await GUN.SEA.decrypt(decData, sharedSecret);

                            pageLayout.find("#encryptData").val(dec);
                            pageLayout.find("#pills-encrypt-tab").click();
                        });


                    });

                    $("#derive_shared_secrets").click(async function() {
                        var AdditionalData = $("#onlykey_additional_data").val();
                        var OK_sharedPubKey = $("#onlykey_pubkey").val();

                        (async function() {
                            var ok_pubkey_decoded = onlykey.decode_key(OK_sharedPubKey);

                            var pair_bob = JSON.parse($("#sea_test_key").val());
                            var bobPubKey = pair_bob.epub; //<-- hex encoded
                            var bobPrivKey = pair_bob.epriv; //<-- hex encoded

                            var bobPubKey_decoded = onlykey.decode_key(bobPubKey); //<-- uint8array
                            var bobPrivKey_decoded = onlykey.decode_key(bobPrivKey); //<-- uint8array

                            console.log("bob1", onlykey.encode_key(bobPubKey_decoded));
                            console.log("bob2", onlykey.encode_key(bobPrivKey_decoded));

                            console.log("bobs_pair", pair_bob);

                            var nacl = require("nacl");
                            //nacl.scalarMult(bob priv key, sharedPub)
                            var ss = nacl.scalarMult(bobPrivKey_decoded, ok_pubkey_decoded);
                            // var ss = nacl.box.before(hex_decode(OK_sharedPubKey), bobPrivKey_decoded);

                            // await onlykey.build_AESGCM(ss)
                            var Bob_generated_sharedSecret = await onlykey.build_AESGCM(ss); //hex_encode(ss);

                            console.log("nacl:x25519 Bob_generated_sharedSecret", Bob_generated_sharedSecret);
                            $("#sea_test_shared_secret").val(Bob_generated_sharedSecret);

                            onlykey.derive_shared_secret(AdditionalData, bobPubKey, keyType, press_required, async function(err, sharedSecret) {
                                if (err) console.log(err);
                                $("#ok_test_shared_secret").val(sharedSecret);

                                console.log("elliptic_curve25519: bobPubKey: ", bobPubKey);
                                console.log("elliptic_curve25519: Bob_generated_sharedSecret: ", Bob_generated_sharedSecret);
                            });
                        })();
                    });

                    // (async function() {
                    //     $("#sea_test_key").text(JSON.stringify(await GUN.SEA.pair()))
                    // })()
                    
                    pageLayout.find("#connect_onlykey").click();
                }


                if (testType.split("-")[0] == "P256R1_SIGN") {

                    keyType = 1; //P256R1

                    onlykey = ONLYKEY();

                    onlykey.on("status", function() {
                        var args = [];
                        for (var i = 0; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        var s = args.join(" ");
                        $("#console_output").append($("<span/>").text(s));
                        $("#console_output").append($("<br/>"));
                        $("#connection_status").text(s);
                    });
                    
                    pageLayout = $(require("text!./pageLayout_P256R1_SIGN.html"));
                    
                    
                    $("#main-container").html(pageLayout);
                    

                    $("#connect_onlykey").click(function() {
                        onlykey.connect(async function() {
                            console.log("onlykey has connected");
                            pageLayout.find("#connect_onlykey").hide();
                            pageLayout.find("#connected_onlykey").show();

                            // pageLayout.find("#derive_public_key").click();
                        });
                    });


                    $("#derive_public_key").click(function() {
                        var AdditionalData = $("#onlykey_additional_data").val();
                        onlykey.derive_public_key(AdditionalData, keyType, press_required, async function(err, ok_jwk_epub) {
                            if (err) console.log(err);
                            pageLayout.find("#onlykey_pubkey").val(ok_jwk_epub);

                            if ($("#encryptKey").val() == "")
                                $("#encryptKey").val(ok_jwk_epub);

                            if ($("#decryptKey").val() == "")
                                $("#decryptKey").val(ok_jwk_epub);


                            pageLayout.find("#encryptData").val("test");
                            //$("#encryptBTN").click();


                        });
                    });
                    
                    
                    $("#signBTN").click(async function() {

                        var encData = pageLayout.find("#encryptData").val();
                        var input_jwk_epub = pageLayout.find("#encryptKey").val(); //.split("")
                        //onlykey.b642bytes()

                        var AdditionalData = $("#onlykey_additional_data").val();
                        onlykey.derive_shared_secret(AdditionalData, input_jwk_epub, keyType, press_required, async function(err, sharedSecret, ok_jwk_epub) {
                            if (err) console.log(err);
                            var enc = await GUN.SEA.encrypt(encData, sharedSecret);

                            //pageLayout.find("#encryptData").val(enc);
                            pageLayout.find("#decryptData").val(enc);
                            pageLayout.find("#pills-decrypt-tab").click();
                        });


                    });

                    $("#verifyBTN").click(async function() {

                        var decData = pageLayout.find("#decryptData").val();
                        var input_jwk_epub = pageLayout.find("#decryptKey").val();

                        var AdditionalData = $("#onlykey_additional_data").val();
                        onlykey.derive_shared_secret(AdditionalData, input_jwk_epub, keyType, press_required, async function(err, sharedSecret, ok_jwk_epub) {
                            if (err) console.log(err);
                            //var enc = await SEA.encrypt('shared data', await SEA.secret(bob.epub, alice));

                            var dec = await GUN.SEA.decrypt(decData, sharedSecret);

                            pageLayout.find("#encryptData").val(dec);
                            pageLayout.find("#pills-encrypt-tab").click();
                        });


                    });


                    $("#connect_onlykey").click();

                }


            });

        }
    };







})
