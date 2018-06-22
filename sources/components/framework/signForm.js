import React                                from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableHighlight} from "react-native";
import { Container, Header, Content, Item, Input, Label, Icon, Right, ListItem } from 'native-base';
import PropTypes                            from 'prop-types';
import Styles                               from 'components/styles.json';
import IconF 			                          from "react-native-vector-icons/FontAwesome";
import { FormLabel, FormInput }             from 'react-native-elements'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import DatePickerAndroid                    from "framework/DatePickerAnd.js"
import SegmentedControlAndroid              from "framework/SegmentedControlAndroid.js"
import cloneDeep                            from 'clone-deep';
import CreateClass from 'create-react-class';
var styles = StyleSheet.create(Styles);

const LOGIN = 0;
const REGISTER = 1;
const FORGOT_PASSWORD = 2;
const EDIT_PROFIL = 3;
const PARAMETER = 4;
const PASSWORD = 5;
const MAIL = 6;
const Picture = 7;
const VISIT_DEMAND = 8;
const PAYMENT = 9;
const NEWCARD = 10;

// RegEx for fields inputs

const regEmail    = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/); //or any other regexp
const regPassword = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]{4,}$/);
const regSpe      = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]$/);
const regLength3  = new RegExp(/^[A-Za-z0-9áéíóú_]{3,}$/);
const regName     = new RegExp(/^[A-Za-záéíóú-]{2,}$/);
const regPhone    = new RegExp(/^(\+33 |0)[1-9]( \d\d){4}$/);
const regNumber   = new RegExp(/^\d+$/);
const regbdate    = new RegExp(/^\d+$/);
const regAlNumAcc = new RegExp(/^[A-Za-z0-9áéíóú]$/);
const max3        = new RegExp(/^\d{0,3}$/);
const max4        = new RegExp(/^\d{0,4}$/);
const max2        = new RegExp(/^\d{0,2}$/);


const t = require('tcomb-form-native')
t.form.Form.stylesheet = styles;
let Form = t.form.Form

/**
 * ### Translations
 */
 // TODO : FR/EN...
var I18n = require('react-native-i18n')
import Translations from '../translation.json'
I18n.translations = Translations

var SignForm = CreateClass({
  /**
   * ## SignForm class
   *
   * * form: the properties to set into the UI form
   * * value: the values to set in the input fields
   * * onChange: function to call when user enters text
   */
  propTypes: {
    formType: PropTypes.number,
    form: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func
  },

  /**
   * ## render
   *
   * setup all the fields using the props and default messages
   *
   */
  render () {
    let formType = this.props.formType

    let options = {
      fields: {

      },
      auto: 'placeholders'
    }

    let name = {
      hasError: true,
      template : templateInputs,
      error: I18n.t('FormError')['errorName'],
      config : {
        reg: regLength3,
        styleIcon: styles.iconLineProfile,
        styleText: styles.inputsField,
        iconColor: 'white',
        iconSize: 20,
        secure: false,
        icon: 'user-plus',
      }
    }

    let interests = {
      label: I18n.t('SignForm.interests'),
      // template : templateInputs
    }

    let text = {
      template : templateInputs,
      config : {
        styleIcon: styles.iconLineProfile,
        styleText: styles.inputsWhite,
        icon: 'book',
        iconColor: 'black',
        iconSize: 20,
      }
      // provide an editor
    }

    let gender = {
      template : templateRadio,
      config : {
        dir: true,
        pone: I18n.t('Profile')['man'],
        ptwo: I18n.t('Profile')['woman'],
        styleIcon: styles.iconLineProfile,
        icon: 'venus-mars',
        iconColor: 'black',
        iconSize: 20,
      }
    }

    let date = {
      template : templateDatePickerBase,
      config : {
        styleIcon: styles.iconLineProfileBDay,
        styleText: styles.inputsWhite,
        icon: 'calendar',
        iconColor: 'black',
        iconSize: 20,
      }
    }

    let phone = {
      template : templateInputs,
      hasError : true,
      error: I18n.t('FormError')['errorPhone'],
      config : {
        reg: regPhone,
        styleIcon: styles.iconLineProfile,
        styleText: styles.inputsWhite,
        keyboardType: 'phone-pad',
        icon: 'phone',
        iconColor: 'black',
        iconSize: 20,
      }
    }

    let number = {
      template : templateInputs,
      hasError : true,
      error: I18n.t('FormError')['errorDigit'],
      config : {
        reg: regNumber,
        keyboardType : 'numeric',
        container: styles.containerInputsNoFlex,
        styleIcon: styles.iconLineProfile,
        styleText: styles.inputsBlue,
        icon: 'users',
        iconColor: 'black',
        iconSize: 20
      }
    }

    let url = {
      template : templateInputs,
      config : {
        container: styles.containerInputsNoFlex,
        styleIcon: styles.iconLineProfile,
        styleText: styles.inputsBlue,
        icon: 'picture-o',
        iconColor: 'black',
        iconSize: 20,
      }
    }

    let email = {
      // TODO : TRANSLATE
      error: I18n.t('FormError')['errorEmail'],
      template : templateInputBaseRounded,
      placeholder : I18n.t('SignForm')['email'],
      hasError: true,
      config : {
        reg: regEmail,
        keyboardType: 'email-address',
        styleText: styles.inputsField,
        styleIcon: styles.iconLineProfile,
        icon: 'md-at',
        iconStyle : styles.iconStyleBaseRounded,
        iconColor: 'white',
        iconSize: 20,
        secure: false,
      }
    }

// TODO : checkbox show password
    let secureTextEntry = true;

    let password = {
      hasError: true,
      error: I18n.t('FormError')['errorPassword'],
      secureTextEntry: secureTextEntry,
      template : templateInputBaseRounded,
      placeholder : I18n.t('SignForm')['password'],
      config : {
        reg: regPassword,
        styleText: styles.inputsField,
        icon: 'md-lock',
        styleIcon: styles.iconLinePassword,
        iconStyle : styles.iconStyleBaseRounded,
        iconColor: 'white',
        iconSize: 20
      }
    }

    let signForm
    switch (formType) {

      case (REGISTER):
        signForm = t.struct({
          first_name: t.String,
          last_name: t.String,
          email: t.String,
          password: t.String        })
          options.fields['first_name'] = cloneDeep(name);
          options.fields['first_name'].template = templateInputBaseRounded;
          options.fields['first_name'].error = I18n.t('FormError')['errorfirst_name'];
          options.fields['first_name'].placeholder = I18n.t('SignForm')['first_name'];

          Object.assign(options.fields['first_name'].config,
            {reg: regName, styleText: styles.inputsWhite, icon: 'md-contact', iconStyle : styles.iconStyleBaseRounded})
          options.fields['last_name'] = cloneDeep(name)
          options.fields['last_name'].template = templateInputBaseRounded;
          options.fields['last_name'].error = I18n.t('FormError')['errorlast_name'];
          options.fields['last_name'].placeholder = I18n.t('SignForm')['last_name'];

          Object.assign(options.fields['last_name'].config,
            {reg: regName, styleText: styles.inputsWhite, iconStyle : styles.iconStyleBaseRounded, icon: 'md-contact'})
        options.fields['email'] = email
        options.fields['password'] = password


        break

      case (LOGIN):
        signForm = t.struct({
          email: t.String,
          password: t.String
        })
        options.fields['email'] = email
        options.fields['password'] = password


        break

      case (PARAMETER):
        signForm = t.struct({
          email: t.String,
          password: t.String
        })
        options.fields['email'] = email
        options.fields['email'].template = templateNoIcon
        Object.assign(options.fields['email'].config,
          {container: styles.containerInputsNoFlex, styleText: styles.inputsWhite})
        options.fields['password'] = password
        options.fields['password'].template = templateNoIcon
        Object.assign(options.fields['password'].config,
          {container: styles.containerInputsNoFlex, styleText: styles.inputsWhite})

        break

      case (PASSWORD):
        signForm = t.struct({
          password: t.String,
          newPassword: t.String,
          passwordAgain: t.String,
        })

        Object.assign(password.config,
          {container: styles.containerInputsNoFlex, styleText: styles.inputsWhite, iconColor: 'black' })
        options.fields['password'] = password
        options.fields['newPassword'] = cloneDeep(password)
        options.fields['newPassword'].placeholder = I18n.t('SignForm')['newPassword'];
        options.fields['passwordAgain'] = cloneDeep(password)
        options.fields['passwordAgain'].placeholder = I18n.t('SignForm')['password_again'];



        break

      case (MAIL):
        signForm = t.struct({
          password: t.String,
          newMail: t.String,
          emailAgain: t.String
        })
        options.fields['password'] = password
        Object.assign(options.fields['password'].config,
          {container: styles.containerInputsNoFlex, styleText: styles.inputsWhite, iconColor: 'black'})
        Object.assign(email.config,
          {container: styles.containerInputsNoFlex, styleIcon: styles.iconLinePassword, styleText: styles.inputsWhite, iconColor: 'black'})
        options.fields['newMail'] = cloneDeep(email)
        options.fields['newMail'].placeholder = I18n.t('SignForm')['newMail'];
        options.fields['emailAgain'] = cloneDeep(email)
        options.fields['emailAgain'].placeholder = I18n.t('SignForm')['email_again'];


        break

      case (FORGOT_PASSWORD):
        signForm = t.struct({
          email: t.String
        })
        options.fields['email'] = email
        //options.fields['email'].autoCapitalize = 'none'
        break

      case (EDIT_PROFIL):
        signForm = t.struct({
          first_name: t.String,
          last_name: t.String,
          description: t.String,
          city: t.String,
          country: t.String,
        })
        options.fields['first_name'] = cloneDeep(name);
        options.fields['first_name'].template = templateInputBase;
        options.fields['first_name'].error = I18n.t('FormError')['errorfirst_name'];
        options.fields['first_name'].placeholder = I18n.t('SignForm')['first_name'];

        Object.assign(options.fields['first_name'].config,
          {reg: regName, styleText: styles.inputsWhite, iconStyle : styles.iconStyleBase, icon: 'md-contact', iconColor: 'black'})
        options.fields['last_name'] = cloneDeep(name)
        options.fields['last_name'].template = templateInputBase;
        options.fields['last_name'].error = I18n.t('FormError')['errorlast_name'];
        options.fields['last_name'].placeholder = I18n.t('SignForm')['last_name'];

        Object.assign(options.fields['last_name'].config,
          {reg: regName, styleText: styles.inputsWhite, iconStyle : styles.iconStyleBase, icon: 'md-contact', iconColor: 'black'})

        // options.fields['interests'] = interests

        options.fields['description'] = text
        options.fields['description'].template = templateInputBase;
        options.fields['description'].placeholder = I18n.t('SignForm')['description'];

        Object.assign(options.fields['description'].config,
          {styleText: styles.inputsWhite, iconStyle : styles.iconStyleBase, iconColor: 'black'})
        options.fields['city'] = cloneDeep(name)
        options.fields['city'].template = templateInputBase;
        options.fields['city'].placeholder = I18n.t('SignForm')['city'];

        Object.assign(options.fields['city'].config,
          {styleText: styles.inputsWhite, iconStyle : styles.iconStyleBase, icon: 'md-flag', iconColor: 'black'})
        options.fields['country'] = cloneDeep(name)
        options.fields['country'].template = templateInputBase;
        options.fields['country'].placeholder = I18n.t('SignForm')['country'];

        Object.assign(options.fields['country'].config,
          {styleText: styles.inputsWhite, iconStyle : styles.iconStyleBase, icon: 'globe', iconColor: 'black'})
        options.fields['phone'] = phone
        options.fields['phone'].template = templateInputBase;
        options.fields['phone'].placeholder = I18n.t('SignForm')['phone'];

        Object.assign(options.fields['phone'].config,
          {iconStyle : styles.iconStyleBase, icon: 'md-call', iconColor: 'black'})
        options.fields['gender'] = gender
        options.fields['birthdate'] = date
        options.fields['birthdate'].error = I18n.t('FormError')['errorBirthdate']


        break

      case (Picture):
        signForm = t.struct({
          title: t.String,
          description: t.String,
          city: t.String,
          country: t.String
      })
      options.fields['title'] = cloneDeep(name)
      options.fields['title'].template = templateInputBase;
      options.fields['title'].placeholder = I18n.t('SignForm')['title']

      Object.assign(options.fields['title'].config,
        {container: styles.containerInputsNoFlex, styleText: styles.inputsBlue, iconStyle : styles.iconStyleBase, icon: 'md-image', iconColor: 'black'})
        options.fields['description'] = text
        options.fields['description'].template = templateInputBase;
        options.fields['description'].placeholder = I18n.t('SignForm')['description']

        Object.assign(options.fields['description'].config,
          {styleText: styles.inputsWhite, iconStyle : styles.iconStyleBase, iconColor: 'black'})
          options.fields['city'] = cloneDeep(name)
      options.fields['city'].template = templateInputBase;
      options.fields['city'].placeholder = I18n.t('SignForm')['city']

      Object.assign(options.fields['city'].config,
        {styleText: styles.inputsWhite, iconStyle : styles.iconStyleBase, icon: 'md-flag', iconColor: 'black'})
      options.fields['country'] = cloneDeep(name)
      options.fields['country'].template = templateInputBase;
      options.fields['country'].placeholder = I18n.t('SignForm')['country']

      Object.assign(options.fields['country'].config,
        {styleText: styles.inputsWhite, iconStyle : styles.iconStyleBase, icon: 'globe', iconColor: 'black'})

      break

      case (VISIT_DEMAND):
        signForm = t.struct({
          numberVisitors: t.Number,
          special: t.String,
          when: t.Date
      })
      options.fields['numberVisitors'] = number
      options.fields['numberVisitors'].template = templateInputBase
      options.fields['numberVisitors'].placeholder = I18n.t('SignForm')['numberVisitors']

      Object.assign(options.fields['numberVisitors'].config,
      {container: styles.containerInputsNoFlex, styleText: styles.inputsBlue, iconStyle : styles.iconStyleBase, icon: 'md-contacts', iconColor: 'black'})

      options.fields['special'] = text
      options.fields['special'].template = templateInputBase
      options.fields['special'].placeholder = I18n.t('SignForm')['special']

      Object.assign(options.fields['special'].config,
      {container: styles.containerInputsNoFlex, styleText: styles.inputsBlue, iconStyle : styles.iconStyleBase, icon: 'md-text', iconColor: 'black'})

      options.fields['when'] = date
      Object.assign(options.fields['when'].config,
        {container: styles.containerInputsNoFlex, styleText: styles.inputsBlue, iconStyle : styles.iconStyleBase, icon: 'calendar'})

      break

      case (PAYMENT):
        signForm = t.struct({
          amount: t.Number,
      })
      options.fields['amount'] = number
      options.fields['amount'].template = templateInputBase
      options.fields['amount'].placeholder = I18n.t('SignForm')['amount']

      Object.assign(options.fields['amount'].config,
      {container: styles.containerInputsNoFlex, styleText: styles.inputsWhite, iconStyle : styles.iconStyleBase, icon: 'md-arrow-dropright-circle', iconColor: 'black'})

      break

      case (NEWCARD):
        signForm = t.struct({
          number: t.Number,
          expirationMonth: t.Number,
          expirationYear: t.Number,
          cvc: t.Number,
      })
      number.template = templateNoIcon
      options.fields['number'] = cloneDeep(number)
      options.fields['number'].template = templateInputBase
      Object.assign(options.fields['number'].config,
      {container: styles.containerInputsNoFlex, styleText: styles.inputsWhite, iconStyle : styles.iconStyleBase, icon: 'md-arrow-dropright-circle', iconColor: 'black'})
      options.fields['expirationMonth'] = cloneDeep(number)
      options.fields['expirationMonth'].template = templateInputBase
      options.fields['expirationMonth'].error = I18n.t('FormError')['errorMonth']
      options.fields['expirationMonth'].placeholder = I18n.t('SignForm')['expirationMonth']

      Object.assign(options.fields['expirationMonth'].config,
      {container: styles.containerInputsNoFlex, reg: max2, styleText: styles.inputsBlue, iconStyle : styles.iconStyleBase, icon: 'md-arrow-dropright-circle', iconColor: 'black'})
      options.fields['expirationYear'] = cloneDeep(number)
      options.fields['expirationYear'].template = templateInputBase
      options.fields['expirationYear'].error = I18n.t('FormError')['errorYear']
      options.fields['expirationYear'].placeholder = I18n.t('SignForm')['expirationYear']

      Object.assign(options.fields['expirationYear'].config,
      {container: styles.containerInputsNoFlex, reg: max4, styleText: styles.inputsBlue, iconStyle : styles.iconStyleBase, icon: 'md-arrow-dropright-circle', iconColor: 'black'})
      options.fields['cvc'] = cloneDeep(number)
      options.fields['cvc'].template = templateInputBase
      options.fields['cvc'].error = I18n.t('FormError')['errorCvc']
      options.fields['cvc'].placeholder = I18n.t('SignForm')['cvc']

      Object.assign(options.fields['cvc'].config,
      {container: styles.containerInputsNoFlex, reg: max3, styleText: styles.inputsBlue, iconStyle : styles.iconStyleBase, icon: 'md-arrow-dropright-circle', iconColor: 'black'})



      break
  } // switch

// TODO : AFFINER TEXTINPUT ex : https://github.com/gcanti/tcomb-form-native/blob/master/lib/templates/bootstrap/textbox.js
// TODO : RADIO homme femme
function templateRadio(locals) {
  var radio_props = [
    {label: locals.config.pone, value: 0 },
    {label: locals.config.ptwo, value: 1 }
  ];
  return (
    <RadioForm
    radio_props={radio_props}
    style={locals.config.style ? locals.config.style : {justifyContent: "space-around", marginTop: 15, marginBottom: 15}}
    formHorizontal={locals.config.dir}
    initial={Number(locals.value)}
    onPress={(value) => locals.onChange(value.toString())}
  />
  );

}

function templateRadioBase(locals) {
  var radio_props = [
    {label: locals.config.pone, value: 0 },
    {label: locals.config.ptwo, value: 1 }
  ];
  return (
    <Content>
           <Text>Daily Stand Up</Text>
             <Radio selected={false} />
          <Right>
           <Text>Discussion with Client</Text>
             <Radio selected={true} />
          </Right>
       </Content>
  );

}

function templateInputsUnderline(locals) {

    return (
        <View >
          <FormLabel>{locals.config.label}</FormLabel>
          <FormInput onChangeText={(value) => locals.onChange(value)}/>
        </View>
    );
  }

  function openDatePicker(value) {
    DatePickerAndroid.open({
      date: value
    }).then((res) => {
      if (res.action !== DatePickerAndroid.dismissedAction) {
        value = res;
      }
    });
  }

  function templateDatePicker(locals) {

    return (
    <View style={locals.config.container ? locals.config.container : styles.containerInputs}>
        <DatePickerAndroid value={locals.value} onChange={(value) => locals.onChange(value.toString())}/>
    </View>
    );
  }

  function templateDatePickerBase(locals) {

    return (
    <Content>
    <ListItem style={styles.listItem}>
        <Icon name={locals.config.icon} style={styles.iconStyle}/>
        <DatePickerAndroid value={locals.value} onChange={(value) => locals.onChange(value.toString())}/>
    </ListItem>
    </Content>
    );
  }

function templateDatePickerIcon(locals) {

  return (
    <TouchableHighlight  style={/*onPress={() => openDatePicker(locals.value)}p */locals.config.container ? locals.config.container : styles.containerInputs}>
      <view>
        <Icon
          style={locals.config.styleIcon ? locals.config.styleIcon : styles.iconLine}
          name            = {locals.config.icon}
          color 		      = {locals.config.iconColor}
          size            = {locals.config.iconSize}
        >
      </Icon>
        <Text style={locals.config.styleText ? locals.config.styleText : styles.inputsField}>
          {/*locals.value.day + " " + locals.value.month + " " + locals.value.year*/}
        </Text>
      </view>
    </TouchableHighlight>
  );
}

function templateInputBase(locals) {
  var errorText = null;
  var item = null;

  if (locals.config.reg && locals.value != "" && !(locals.config.reg.test(locals.value))) {
    errorText = <Text style={styles.textError}> {locals.error} </Text>
    locals.config.styleText = styles.inputsError;
    item =   <Item floatingLabel error>
                   <Label>{locals.label}</Label>
          <Icon
            name            = {locals.config.icon}
            style           = {locals.config.iconStyle}
            >
            </Icon>
          <Input
          placeholder={locals.placeholder}
          secureTextEntry={locals.secureTextEntry}
          autoCapitalize="none"
          returnKeyType="done"
          underlineColorAndroid='transparent'
          hasError={locals.hasError}
          error={locals.error}
          keyboardType={locals.config.keyboardType}
          onChangeText={(value) => locals.onChange(value)}
          value={locals.value}
          />
          <Icon name='md-close-circle'
          style           = {locals.config.iconStyle}
          />
          </Item>;
  }
  else {
    item =   <Item floatingLabel>
                   <Label>{locals.label}</Label>
          <Icon
            name            = {locals.config.icon}
            style           = {locals.config.iconStyle}
            >
            </Icon>
          <Input
          placeholder={locals.placeholder}
          secureTextEntry={locals.secureTextEntry}
          autoCapitalize="none"
          returnKeyType="done"
          underlineColorAndroid='transparent'
          hasError={locals.hasError}
          error={locals.error}
          keyboardType={locals.config.keyboardType}
          onChangeText={(value) => locals.onChange(value)}
          value={locals.value}
          />
          </Item>
  }

  return (
    <Content>
    {errorText}
      {item}
      </Content>
    );
}

function templateInputBaseRounded(locals) {
  var errorText = null;
  var item = null;

  if (locals.config.reg && locals.value != "" && !(locals.config.reg.test(locals.value))) {
    errorText = <Text style={styles.textError}> {locals.error} </Text>
    locals.config.styleText = styles.inputsError;
    item =   <Item rounded error style={{marginTop : 10}}>
                   <Label>{locals.label}</Label>
                   <Icon name='md-close-circle'
                   />
          <Input
          style={{color : "white"}}
          placeholder={locals.placeholder}
          placeholderTextColor={locals.config.placeholderColor ? locals.config.placeholderColor : "white" }
          secureTextEntry={locals.secureTextEntry}
          autoCapitalize="none"
          returnKeyType="done"
          underlineColorAndroid='transparent'
          hasError={locals.hasError}
          error={locals.error}
          keyboardType={locals.config.keyboardType}
          onChangeText={(value) => locals.onChange(value)}
          value={locals.value}
          />
          </Item>;
  }
  else {
    item =   <Item rounded style={{marginTop : 10}}>
                   <Label>{locals.label}</Label>
          <Icon
            name            = {locals.config.icon}
            style           = {locals.config.iconStyle}
            >
            </Icon>
          <Input
          style={{color : "white"}}
          placeholder={locals.placeholder}
          placeholderTextColor={locals.config.placeholderColor ? locals.config.placeholderColor : "white" }
          secureTextEntry={locals.secureTextEntry}
          autoCapitalize="none"
          returnKeyType="done"
          underlineColorAndroid='transparent'
          hasError={locals.hasError}
          error={locals.error}
          keyboardType={locals.config.keyboardType}
          onChangeText={(value) => locals.onChange(value)}
          value={locals.value}
          />
          </Item>
  }

  return (
    <Content>
    {errorText}
      {item}
      </Content>
    );
}



  function templateInputs(locals) {
    var error = null;
    if (locals.config.reg && locals.value != "" && !(locals.config.reg.test(locals.value))) {
      error = <Text style={styles.textError}> {locals.error} </Text>
      locals.config.styleText = styles.inputsError;
    }

    return (
        <View>
        {error}
          <View style={locals.config.container ? locals.config.container : styles.containerInputs}>
          <IconF
            style={locals.config.styleIcon ? locals.config.styleIcon : styles.iconLine}
            name            = {locals.config.icon}
            color 		      = {locals.config.iconColor}
            size            = {locals.config.iconSize}
            >
            </IconF>
          <TextInput style={locals.config.styleText ? locals.config.styleText : styles.inputsField}
          label={locals.label}
          placeholder={locals.placeholder}
          secureTextEntry={locals.secureTextEntry}
          autoCapitalize="none"
          returnKeyType="done"
          underlineColorAndroid='transparent'
          hasError={locals.hasError}
          error={locals.error}
          keyboardType={locals.config.keyboardType}
          onChangeText={(value) => locals.onChange(value)}
          value={locals.value}
          />
          </View>
        </View>
      );
  }

  function templateNoIcon(locals) {
    var error = null;
    if (locals.config.reg && locals.value != "" && !(locals.config.reg.test(locals.value))) {
      error = <Text style={styles.textError}> {locals.error} </Text>
      locals.config.styleText = styles.inputsError;
    }
    return (
      <View>
      {error}
        <View>
          <TextInput style={locals.config.styleText ? locals.config.styleText : styles.inputsField}
            label={locals.label}
            placeholder={locals.placeholder}
            secureTextEntry={locals.secureTextEntry}
            autoCapitalize="none"
            returnKeyType="done"
            underlineColorAndroid='transparent'
            keyboardType={locals.config.keyboardType}
            onChangeText={(value) => locals.onChange(value)}
            value={locals.value}
          />
        </View>
      </View>
    );
  }

    /**
     * ### Return
     * returns the FormT component with the correct structures
     */
    return (
      <Form ref='FormError'
        type={signForm}
        options={options}
        value={this.props.value}
        onChange={this.props.onChange}
      />

    )
  }
})

module.exports = SignForm