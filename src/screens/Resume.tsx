import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/GlobalStyles';
import { colors, iconSize, sizes, spacing, typography } from '../styles/theme';
import { TabScreenProps } from '../types/navigation';
import { Balance } from '../types/balance';
import { CategoryTotal } from '../types/categoryTotal';
import { getBalance, getGastosPorCategoria } from '../services/api';
import { Fab } from '../components/Fab';
import { ProgressBar } from '../components/ProgressBar';
import { SelectorMes } from '../components/SelectorMes';
import { useMes } from '../context/MesContext';
import { formatCOP, nombreMes } from '../utils/format';

type Props = TabScreenProps<'Resume'>;

type FilaProps = {
  icono: keyof typeof Ionicons.glyphMap;
  color: string;
  etiqueta: string;
  monto: string;
};


function FilaTotal({ icono, color, etiqueta, monto }: FilaProps) {
  return (
    <View style={[globalStyles.tile, globalStyles.tileRow]}>
      <View style={globalStyles.iconRowWide}>
        <Ionicons name={icono} size={iconSize.xl} color={color} />
        <Text style={typography.body}>{etiqueta}</Text>
      </View>
      <Text style={typography.bodyBold}>{monto}</Text>
    </View>
  );
}

export function Resume({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { mes } = useMes();


  const [balance, setBalance] = useState<Balance | null>(null);
  const [categorias, setCategorias] = useState<CategoryTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingCats, setLoadingCats] = useState(true);
  const [errorCats, setErrorCats] = useState<string | null>(null);

  
  useFocusEffect(
    useCallback(() => {
      let activo = true;
      setLoading(true);
      setLoadingCats(true);

      getGastosPorCategoria(mes)
        .then((cats) => {
          if (!activo) return;
          setCategorias(cats);
          setErrorCats(null);
        })
        .catch((e) => {
          if (!activo) return;
          setCategorias([]);
          setErrorCats(e.message);
        })
        .finally(() => activo && setLoadingCats(false));

      getBalance(mes)
        .then((bal) => {
          if (!activo) return;
          setBalance(bal);
          setError(null);
        })
        .catch((e) => {
          if (!activo) return;
          setBalance(null);
          setError(e.message);
        })
        .finally(() => activo && setLoading(false));
      return () => {
        activo = false;
      };
    }, [mes])
  );

  const montoOVacio = (valor?: number) => (loading || valor === undefined ? '—' : formatCOP(valor));

  return (
    <View style={globalStyles.sheet}>
      {/* Texto claro en la barra de estado solo mientras esta pestaña está visible */}
      {isFocused && <StatusBar style="light" />}

      <ScrollView contentContainerStyle={{ paddingBottom: sizes.fabClearance }}>
        <View style={[globalStyles.hero, { paddingTop: insets.top + spacing.xl }]}>
          <SelectorMes titulo="Resumen" claro />
          <Text style={globalStyles.heroAmount}>{montoOVacio(balance?.balance)}</Text>
          <Text style={globalStyles.heroNote}>disponible para ahorrar</Text>
        </View>

        <View style={globalStyles.screenBody}>
          {loading && <ActivityIndicator color={colors.primary} />}

          {error && (
            <Text style={{ color: colors.danger }}>
              No se pudo cargar el resumen. Revisa que la API esté encendida. ({error})
            </Text>
          )}

          <FilaTotal
            icono="arrow-down-circle-outline"
            color={colors.success}
            etiqueta="Ingresos"
            monto={montoOVacio(balance?.balance_ingreso)}
          />
          <FilaTotal
            icono="arrow-up-circle-outline"
            color={colors.danger}
            etiqueta="Gastos"
            monto={montoOVacio(balance?.balance_gasto)}
          />

          <Text style={[typography.caption, { marginTop: spacing.md }]}>Gastos por categoría</Text>

          {loadingCats && <ActivityIndicator color={colors.primary} />}

          {errorCats && (
            <Text style={{ color: colors.danger }}>No se pudieron cargar las categorías. ({errorCats})</Text>
          )}

          {!loadingCats && !errorCats && categorias.length === 0 && (
            <Text style={typography.caption}>No hay gastos en {nombreMes(mes)}.</Text>
          )}

          {categorias.map((c) => (
            <View key={c.categoria_id} style={{ gap: spacing.xs }}>
              <View style={globalStyles.rowBetween}>
                <Text style={typography.body}>{c.nombre}</Text>
                <Text style={typography.body}>{formatCOP(c.total)}</Text>
              </View>
              <ProgressBar porcentaje={c.porcentaje} variante="categoria" />
            </View>
          ))}
        </View>
      </ScrollView>

      <Fab accessibilityLabel="Nuevo movimiento" onPress={() => navigation.navigate('Inputs')} />
    </View>
  );
}
