/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import ImagePicker from 'react-native-image-picker';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      loading: false,
      response: null,
    };

    this.pickerOptions = {
      title: 'Yüklemek İçin Resim Seç',
      noData: true, // dosyanın binary verisi gelmemesi için yapıldı
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    this.launchCamera = this.launchCamera.bind(this);
    this.launchImageLibrary = this.launchImageLibrary.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  launchCamera() {
    ImagePicker.launchCamera(this.pickerOptions, this.uploadFile);
  }

  launchImageLibrary() {
    ImagePicker.launchImageLibrary(this.pickerOptions, this.uploadFile);
  }

  uploadFile(response) {
    if (response.didCancel || response.error || response.customButton)
      return;

    this.setState({
      error: null,
      loading: true,
    });

    // form data türündeki dosya verisi
    const file = {
      uri : response.uri, // dosyanın yolu
      type: response.type, // dosyanın mimeType değeri
      name: response.fileName || `auto-file-${+new Date()}`, // dosyanın ismi
    };

    // multipart/form-data şeklinde gönderilebilmesi için FormData şeklinde tanımlanıyor
    let formdata = new FormData();
    formdata.append('file', file);

    // Sunucuya yükleme işlemi buradan oluyor
    fetch('http://localhost:8080/upload', {
      method: 'PUT',
      body: formdata,
      headers: {
        'Content-Type': 'multipart/form-data', // Bu değeri vermek önemli!
        'Accept': 'application/json',
      },
    })
    .then(res => res.text())
    .then(res => {
      this.setState({
        response: res,
        loading: false,
      });
    })
    .catch(err => {
      this.setState({
        error: err,
        loading: false,
      });
    });
  }

  render() {
    return (
      <SafeAreaView>
        <Header />
        <View style={styles.body}>
          <TouchableOpacity
            onPress={this.launchCamera}
            style={styles.button}>
            <Text style={styles.buttonText}>Kamerayı Açıp Video/Resim Yükle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.launchImageLibrary}
            style={styles.button}>
            <Text style={styles.buttonText}>Galeriden Yükle</Text>
          </TouchableOpacity>
        </View>
        <View>
          {
            // yüklemedeyse göster
            this.state.loading ? <View>
              <ActivityIndicator size='large'/>
            </View> : null
          }

          {
            // hata varsa göster
            this.state.error ? <View>
              <Text>Hata Oluştu: {this.state.error}</Text>
            </View> : null
          }

          {
            // sonuç varsa göster
            this.state.response ? <View>
              <Text>Sonuç: {this.state.response}</Text>
            </View> : null
          }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 15,
    margin: 5,
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
});

export default App;
