import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES, SHADOWS, RADIUS } from '../../constants/theme';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlanDocument = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { plan } = route.params;
  const [selectedFormat, setSelectedFormat] = useState('A4');
  const [loading, setLoading] = useState(true);
  const [pdfData, setPdfData] = useState(null);

  const generatePDF = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`http://10.10.10.14:5000/plans/${plan.plan_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      // 生成 HTML 内容
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #1565C0; }
              .section { margin-bottom: 20px; }
              .label { color: #666; }
              .value { font-weight: bold; }
              table { width: 100%; border-collapse: collapse; }
              td, th { padding: 8px; border: 1px solid #ddd; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
            <h1>Plan Details - ${plan.plan_id}</h1>
            
            <div class="section">
              <h2>Basic Information</h2>
              <table>
                <tr><td class="label">Plan #</td><td>${plan.plan_id || 'N/A'}</td></tr>
                <tr><td class="label">Model #</td><td>${plan.model_id || 'N/A'}</td></tr>
                <tr><td class="label">Body Type</td><td>${plan.body_type || 'N/A'}</td></tr>
                <tr><td class="label">BDM</td><td>${plan.bdm || 'N/A'}</td></tr>
                <tr><td class="label">Wheelbase</td><td>${plan.wheelbase || 'N/A'}</td></tr>
              </table>
            </div>

            <div class="section">
              <h2>Additional Details</h2>
              <table>
                <tr><td class="label">Cabin Type</td><td>${plan.cabin_type || 'N/A'}</td></tr>
                <tr><td class="label">Length</td><td>${plan.length || 'N/A'}</td></tr>
                <tr><td class="label">Model Group</td><td>${plan.model_group || 'N/A'}</td></tr>
                <tr><td class="label">Make</td><td>${plan.make || 'N/A'}</td></tr>
              </table>
            </div>

            <div class="section">
              <h2>Dimensions</h2>
              <table>
                <tr><td class="label">Overall Length</td><td>${plan.overall_length || 'N/A'}</td></tr>
                <tr><td class="label">Overall Width</td><td>${plan.overall_width || 'N/A'}</td></tr>
                <tr><td class="label">Overall Height</td><td>${plan.overall_height || 'N/A'}</td></tr>
              </table>
            </div>
          </body>
        </html>
      `;

      const options = {
        html: htmlContent,
        fileName: `plan_${plan.plan_id}`,
        directory: 'Documents',
        height: selectedFormat === 'A4' ? 842 : 792,
        width: selectedFormat === 'A4' ? 595 : 612,
      };

      const file = await RNHTMLtoPDF.convert(options);
      setPdfData(file.filePath);
      setLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
      setLoading(false);
    }
  };

  const printPDF = async () => {
    if (!pdfData) {
      Alert.alert('Error', 'Please wait for PDF to generate');
      return;
    }

    try {
      await RNPrint.print({ filePath: pdfData });
    } catch (error) {
      console.error('Error printing:', error);
      Alert.alert('Error', 'Failed to print document');
    }
  };

  useEffect(() => {
    generatePDF();
  }, [selectedFormat]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{plan.plan_id}</Text>
        {!loading && (
          <TouchableOpacity
            style={styles.printButton}
            onPress={printPDF}
          >
            <Ionicons name="print-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Loading Indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>
            PDF generated successfully. Click the print icon to print.
          </Text>
        </View>
      )}

      {/* Bottom Format Selection */}
      <View style={styles.bottomContainer}>
        <Text style={styles.formatLabel}>Select Format:</Text>
        <View style={styles.formatButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.formatButton,
              selectedFormat === 'A4' && styles.selectedFormat,
            ]}
            onPress={() => setSelectedFormat('A4')}
          >
            <Ionicons 
              name={selectedFormat === 'A4' ? "radio-button-on" : "radio-button-off"} 
              size={20} 
              color={selectedFormat === 'A4' ? COLORS.primary : COLORS.gray} 
            />
            <Text
              style={[
                styles.formatText,
                selectedFormat === 'A4' && styles.selectedFormatText,
              ]}
            >
              A4
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.formatButton,
              selectedFormat === 'Letter' && styles.selectedFormat,
            ]}
            onPress={() => setSelectedFormat('Letter')}
          >
            <Ionicons 
              name={selectedFormat === 'Letter' ? "radio-button-on" : "radio-button-off"} 
              size={20} 
              color={selectedFormat === 'Letter' ? COLORS.primary : COLORS.gray} 
            />
            <Text
              style={[
                styles.formatText,
                selectedFormat === 'Letter' && styles.selectedFormatText,
              ]}
            >
              Letter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    ...SHADOWS.medium,
  },
  backButton: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  bottomContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...SHADOWS.medium,
  },
  formatLabel: {
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
    marginBottom: SPACING.md,
    fontWeight: '500',
  },
  formatButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    minWidth: 120,
  },
  selectedFormat: {
    backgroundColor: COLORS.white,
  },
  formatText: {
    fontSize: SIZES.medium,
    marginLeft: SPACING.xs,
    color: COLORS.gray,
  },
  selectedFormatText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  printButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  previewText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default PlanDocument; 