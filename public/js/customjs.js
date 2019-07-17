$(document).ready(function(){

	var sdk = new window.sfdc.BlockSDK();

	var language = 'English';
	
	sdk.getContent(function (contentvoucher) {
        var dom_nodes = $($.parseHTML(contentvoucher));
        
		var textColor = dom_nodes.find('#contentvoucher').attr('textcolor');
        if (textColor) {
            $("#text-color").val(textColor);
        }
		var buttonColor = dom_nodes.find('#contentvoucher').attr('buttoncolor');
        if (buttonColor) {
            $("#button-color").val(buttonColor);
        }

		// var radioflag = dom_nodes.find('#contentvoucher').attr('newvoucherflag');
        // if (radioflag = "1")  {
        //  $("#radio-11").prop("checked", true);
		//	$("#radio-12").prop("checked", false);
		//} else {
		//	$("#radio-11").prop("checked", false);
		//	$("#radio-12").prop("checked", true);
        //}
				//var sel = dom_nodes.find('#contentvoucher').attr('dename');
        //if (sel) {
        //    $("#dename").val(sel);
        //}
    });
	
	getLanguage();
	updatePicklistOptions();

	function getLanguage() {
		$.ajax({
			type: "GET",
			url: "/getLanguage",
			success: function(res) {
				language = res;
				console.log(language);
			}
		})
	}

	function updatePicklistOptions() {
		$('#options').hide();
		$('#updateButton').hide();
		$('#radiobuttons').hide();
		$('#text-color').hide();
		$('#button-color').hide();
        $.ajax({
         type: "GET",
         url: "/getDEs",
         success: function(res) {
            console.log('Success');
            console.log(res);
            $('#spinna').hide();
            $('#options').show();
            $('#updateButton').show();
            $('#radiobuttons').show();
            $('#text-color').show();
			$('#button-color').show();

             
            let output = `
							 	<div id="replaceable">
								  <label class="slds-form-element__label" for="select-01">Voucher selection</label>
								  <div class="slds-form-element__control">
								    <div class="slds-select_container">
								      <select class="slds-select" id="dename">
								        <option value="Unselected">Please select voucher</option>`;

	        res.forEach(function (item) {
					    output+=`<option value="${item}">${item}</option>`
					});

	        output += `</select>
						    </div>
						  </div>
						</div>`;


			$('#replaceable').replaceWith(output);
            
        	}
        });
    }


    $("#updateCoupon").click(function(){
        setSDKData();
    });

    function setSDKData() {
    	var sel = $('#dename').val();

    	let newCoupon = $("#radio-11").is(":checked");
		let textColor = $('#text-color').val();
		let buttonColor = $('#button-color').val();
	
		if (!textColor) {
            //default it to black
            textColor = "#000000";
        }
		
		if (!buttonColor) {
            //default it to black
            buttonColor = "#000000";
        }
		
    	if (!newCoupon) {
    		let output = `<style type="text/css">.amp {font-size:1px;color:#f2f2f2;}</style>
<span class="amp">%%[</span>
<style type="text/css">.code_none{display:none;}</style>
<div id="sb-box" align="center" style="margin: 0px auto; padding: 40px 0px; border: 1px dashed rgb(255, 255, 255); max-width: 600px; background: ${buttonColor};">
  <div style="font-family:'Salesforce Sans', Helvetica, Arial, sans-serif;font-weight: 300;font-size: 35px;line-height: 40px;text-align:center; color: #ffffff;" id="cb-block-name">Voucher Block: ${sel}</div>
  <div style="color:#f2f2f2;font-family:'Salesforce Sans', Helvetica, Arial, sans-serif;font-weight: 200;font-size: 24px;line-height: 20px;padding:10px 0px 0px;text-align:center;">Smart Block</div>
</div>
<span class="amp">]%%</span>
<div class="code_none" id="cb-block-code"><table align="center" border="0" cellpadding="0" cellspacing="0" class="tmp--container" style="background-color:#ffffff;" width="100%">
						    <tbody><tr>
						      <td align="left" style="color:#4f4f4f;font-family:Arial, sans-serif;font-size:16px;font-style:normal;font-weight:normal;line-height:20px;padding:20px;text-align:center;vertical-align:top;" width="100%">
						        <span style="color:${textColor};"><span style="display: inline-block; font-family: Arial, sans-serif; font-size: 18px; font-style: normal; font-weight: bold ; padding: 5px 0px 10px;">Your voucher code is:</span></span> 
						        <!-- ============================== -->
						        <!-- CTA BTN -->
						        <!-- ============================== -->
						        <table align="center" class="tmp--full-width" width="100%">
						          <tbody><tr>
						            <td align="center" style="padding:5px 0 10px 0;">
						              <span style="font-family:courier new,courier,monospace;"><a href="" style="border-radius:3px;background-color:${buttonColor};border-top:12px solid ${buttonColor};border-bottom:12px solid ${buttonColor};border-right:18px solid ${buttonColor};border-left:18px solid ${buttonColor};color:#ffffff;display:inline-block;font-family:Arial, sans-serif;font-size:16px;font-style:normal;font-weight:normal;line-height:16px;text-align:center;text-decoration:none;" target="_blank"><b>%%[ SET @CustomerCoupon = LookupOrderedRows('${sel}', 1, 'CouponCode DESC', 'EmailAddress', emailaddr) VAR @Coupon VAR @IsUsed IF RowCount(@CustomerCoupon) == 0 THEN SET @CouponRow = ClaimRow('${sel}', 'IsClaimed', 'EmailAddress', emailaddr, 'Validity', DateAdd(NOW(), '31', 'D')) IF EMPTY(@CouponRow) THEN SET @Coupon = 'No coupons available' ELSE SET @Coupon = FIELD(@CouponRow, 'CouponCode') ENDIF ELSE SET @Coupon = Lookup('${sel}', 'CouponCode', 'EmailAddress', emailaddr) SET @IsUsed = Lookup('${sel}', 'UsedDate', 'CouponCode', @Coupon) IF EMPTY(@IsUsed) THEN SET @ValidDate = Lookup('${sel}', 'Validity', 'EmailAddress', emailaddr) IF DateDiff(NOW(), @ValidDate, 'MI') < 0 THEN SET @Coupon = 'Coupon is expired.' ENDIF ELSE SET @Coupon = 'Sie haben Ihren Coupon schon genutzt' ENDIF ENDIF ]%% %%=v(@Coupon)=%%</b></a></span>
						            </td>
						          </tr>
						        </tbody></table>
						      </td>
						  </tr></tbody></table>
						  <div id="contentvoucher" textcolor="${textColor}" buttoncolor="${buttonColor}" dename="${sel} newvoucherflag="0"</div>
						  </div>`
    		sdk.setContent(output);
    	} else {
    		let output = `<style type="text/css">.amp {font-size:1px;color:#f2f2f2;}</style>
<span class="amp">%%[</span>
<style type="text/css">.code_none{display:none;}</style>
<div id="sb-box" align="center" style="margin: 0px auto; padding: 40px 0px; border: 1px dashed rgb(255, 255, 255); max-width: 600px; background: linear-gradient(rgb(225, 0, 0), rgb(255, 40, 40));">
		<div style="font-family:'Salesforce Sans', Helvetica, Arial, sans-serif;font-weight: 300;font-size: 35px;line-height: 40px;text-align:center; color: #ffffff;" id="cb-block-name">Voucher Block: ${sel}</div>
  <div style="color:#f2f2f2;font-family:'Salesforce Sans', Helvetica, Arial, sans-serif;font-weight: 200;font-size: 24px;line-height: 20px;padding:10px 0px 0px;text-align:center;">Smart Block</div>
</div>
<span class="amp">]%%</span>
<div class="code_none" id="cb-block-code"><table align="center" border="0" cellpadding="0" cellspacing="0" class="tmp--container" style="background-color:#ffffff;" width="100%">
						    <tbody><tr>
						      <td align="left" style="color:#4f4f4f;font-family:Arial, sans-serif;font-size:16px;font-style:normal;font-weight:normal;line-height:20px;padding:20px;text-align:center;vertical-align:top;" width="100%">
						        <span style="color:${textColor};"><span style="display: inline-block; font-family: Arial, sans-serif; font-size: 18px; font-style: normal; font-weight: bold; padding: 5px 0px 10px;">Your voucher code is:</span></span> 
						        <!-- ============================== -->
						        <!-- CTA BTN -->
						        <!-- ============================== -->
						        <table align="center" class="tmp--full-width" width="100%">
						          <tbody><tr>
						            <td align="center" style="padding:5px 0 10px 0;">
						              <span style="font-family:courier new,courier,monospace;"><a href="" style="border-radius:3px;background-color:${buttonColor};border-top:12px solid ${buttonColor};border-bottom:12px solid ${buttonColor};border-right:18px solid ${buttonColor};border-left:18px solid ${buttonColor};color:#ffffff;display:inline-block;font-family:Arial, sans-serif;font-size:16px;font-style:normal;font-weight:normal;line-height:16px;text-align:center;text-decoration:none;" target="_blank"><b>%%[ SET @CouponRow = ClaimRow('${sel}', 'IsClaimed', 'EmailAddress', emailaddr, 'Validity', DateAdd(NOW(), '31', 'D')) IF EMPTY(@CouponRow) THEN SET @Coupon = 'No coupons available' ELSE SET @Coupon = FIELD(@CouponRow, 'CouponCode') ENDIF ]%% %%=v(@Coupon)=%%</b></a></span>
						            </td>
						          </tr>
						        </tbody></table>
						      </td>
						    </tr>
						  </tbody></table>
						  <div id="contentvoucher" textcolor="${textColor}" buttoncolor="${buttonColor}" dename="${sel} newvoucherflag="1"</div>
						  </div>`
						  

				sdk.setContent(output);
    	}
    }
});

