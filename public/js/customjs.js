$(document).ready(function(){

	var sdk = new window.sfdc.BlockSDK();

	updatePicklistOptions();

	function updatePicklistOptions() {
		$('#options').hide();
		$('#updateButton').hide();
		$('#radiobuttons').hide();
        $.ajax({
         type: "GET",
         url: "/getDataExtensions",
         success: function(res) {
            console.log('Success');
            console.log(res);
            $('#spinna').hide();
            $('#options').show();
            $('#updateButton').show();
            $('#radiobuttons').show();

             
            let output = `
							 	<div id="replaceable">
								  <label class="slds-form-element__label" for="select-01">Gutschein Auswahl</label>
								  <div class="slds-form-element__control">
								    <div class="slds-select_container">
								      <select class="slds-select" id="dename">
								        <option value="Unselected">Select a Data Extension</option>`;

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
    	console.log(sel);
    	console.log($("#radio-11").is(":checked"))
    	console.log($("#radio-12").is(":checked"))

    	let newCoupon = $("#radio-11").is(":checked");

    	if (!newCoupon) {
    		let output = `<style type="text/css">.amp {font-size:1px;color:#f2f2f2;}</style>
<span class="amp">%%[</span>
<style type="text/css">.code_none{display:none;}</style>
<div id="sb-box" align="center" style="margin: 0px auto; padding: 40px 0px; border: 1px dashed rgb(255, 255, 255); max-width: 600px; background: linear-gradient(rgb(225, 0, 0), rgb(255, 40, 40));">
  <div style="font-family:'Salesforce Sans', Helvetica, Arial, sans-serif;font-weight: 300;font-size: 35px;line-height: 40px;text-align:center; color: #ffffff;" id="cb-block-name">Gutschein Block</div>
  <div style="color:#f2f2f2;font-family:'Salesforce Sans', Helvetica, Arial, sans-serif;font-weight: 200;font-size: 24px;line-height: 20px;padding:10px 0px 0px;text-align:center;">Smart Block</div>
</div>
<span class="amp">]%%</span>
<div class="code_none" id="cb-block-code"><table align="center" border="0" cellpadding="0" cellspacing="0" class="tmp--container" style="background-color:#ffffff;" width="100%">
						    <tbody><tr>
						      <td align="left" style="color:#4f4f4f;font-family:Arial, sans-serif;font-size:16px;font-style:normal;font-weight:normal;line-height:20px;padding:20px;text-align:center;vertical-align:top;" width="100%">
						        <span style="color:#DD0000;"><span style="display: inline-block; font-family: Arial, sans-serif; font-size: 18px; font-style: normal; font-weight: bold ; padding: 5px 0px 10px;">Ihr Gutschein Code lautet</span></span> 
						        <!-- ============================== -->
						        <!-- CTA BTN -->
						        <!-- ============================== -->
						        <table align="center" class="tmp--full-width" width="100%">
						          <tbody><tr>
						            <td align="center" style="padding:5px 0 10px 0;">
						              <span style="font-family:courier new,courier,monospace;"><a href="" style="border-radius:3px;background-color:#DD0000;border-top:12px solid #DD0000;border-bottom:12px solid #DD0000;border-right:18px solid #DD0000;border-left:18px solid #DD0000;color:#ffffff;display:inline-block;font-family:Arial, sans-serif;font-size:16px;font-style:normal;font-weight:normal;line-height:16px;text-align:center;text-decoration:none;" target="_blank"><b>%%[ SET @CustomerCoupon = LookupOrderedRows('${sel}', 1, 'CouponCode DESC', 'EmailAddress', emailaddr) VAR @Coupon VAR @IsUsed IF RowCount(@CustomerCoupon) == 0 THEN SET @CouponRow = ClaimRow('${sel}', 'IsClaimed', 'EmailAddress', emailaddr, 'Validity', DateAdd(NOW(), '31', 'D')) IF EMPTY(@CouponRow) THEN SET @Coupon = 'No coupons available' ELSE SET @Coupon = FIELD(@CouponRow, 'CouponCode') ENDIF ELSE SET @Coupon = Lookup('${sel}', 'CouponCode', 'EmailAddress', emailaddr) SET @IsUsed = Lookup('${sel}', 'UsedDate', 'CouponCode', @Coupon) IF EMPTY(@IsUsed) THEN SET @ValidDate = Lookup('${sel}', 'Validity', 'EmailAddress', emailaddr) IF DateDiff(NOW(), @ValidDate, 'MI') &lt; 0 THEN SET @Coupon = 'Coupon is expired.' ENDIF ELSE SET @Coupon = 'Sie haben Ihren Coupon schon genutzt' ENDIF ENDIF ]%% %%=v(@Coupon)=%%</b></a></span>
						            </td>
						          </tr>
						        </tbody></table>
						      </td>
						  </tr></tbody></table></div>`
    		sdk.setContent(output);
    	} else {
    		let output = `<style type="text/css">.amp {font-size:1px;color:#f2f2f2;}</style>
<span class="amp">%%[</span>
<style type="text/css">.code_none{display:none;}</style>
<div id="sb-box" align="center" style="margin: 0px auto; padding: 40px 0px; border: 1px dashed rgb(255, 255, 255); max-width: 600px; background: linear-gradient(rgb(225, 0, 0), rgb(255, 40, 40));">
  <div style="font-family:'Salesforce Sans', Helvetica, Arial, sans-serif;font-weight: 300;font-size: 35px;line-height: 40px;text-align:center; color: #ffffff;" id="cb-block-name">Gutschein Block</div>
  <div style="color:#f2f2f2;font-family:'Salesforce Sans', Helvetica, Arial, sans-serif;font-weight: 200;font-size: 24px;line-height: 20px;padding:10px 0px 0px;text-align:center;">Smart Block</div>
</div>
<span class="amp">]%%</span>
<div class="code_none" id="cb-block-code"><table align="center" border="0" cellpadding="0" cellspacing="0" class="tmp--container" style="background-color:#ffffff;" width="100%">
						    <tbody><tr>
						      <td align="left" style="color:#4f4f4f;font-family:Arial, sans-serif;font-size:16px;font-style:normal;font-weight:normal;line-height:20px;padding:20px;text-align:center;vertical-align:top;" width="100%">
						        <span style="color:#DD0000;"><span style="display: inline-block; font-family: Arial, sans-serif; font-size: 18px; font-style: normal; font-weight: bold; padding: 5px 0px 10px;">Ihr Gutschein Code lautet: </span></span> 
						        <!-- ============================== -->
						        <!-- CTA BTN -->
						        <!-- ============================== -->
						        <table align="center" class="tmp--full-width" width="100%">
						          <tbody><tr>
						            <td align="center" style="padding:5px 0 10px 0;">
						              <span style="font-family:courier new,courier,monospace;"><a href="" style="border-radius:3px;background-color:#DD0000;border-top:12px solid #DD0000;border-bottom:12px solid #DD0000;border-right:18px solid #DD0000;border-left:18px solid #DD0000;color:#ffffff;display:inline-block;font-family:Arial, sans-serif;font-size:16px;font-style:normal;font-weight:normal;line-height:16px;text-align:center;text-decoration:none;" target="_blank"><b>%%[ SET @CouponRow = ClaimRow('${sel}', 'IsClaimed', 'EmailAddress', emailaddr, 'Validity', DateAdd(NOW(), '31', 'D')) IF EMPTY(@CouponRow) THEN SET @Coupon = 'No coupons available' ELSE SET @Coupon = FIELD(@CouponRow, 'CouponCode') ENDIF ]%% %%=v(@Coupon)=%%</b></a></span>
						            </td>
						          </tr>
						        </tbody></table>
						      </td>
						    </tr>
						  </tbody></table></div>`
				sdk.setContent(output);
    	}
    }
});
