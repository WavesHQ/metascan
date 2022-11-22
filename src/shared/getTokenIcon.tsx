import BTC from "@components/icons/BTC";
import dBCH from "@components/icons/dBCH";
import DFI from "@components/icons/DFI";
import dBTC from "@components/icons/dBTC";
import dDFI from "@components/icons/dDFI";
import dETH from "@components/icons/dETH";
import dLTC from "@components/icons/dLTC";
import dUSDT from "@components/icons/dUSDT";
import dUSDC from "@components/icons/dUSDC";
import dUSD from "@components/icons/dUSD";
import DefaultToken from "@components/icons/DefaultToken";

interface MappingProps {
  size?: number;
  symbol?: string;
}

const mapping: Record<string, ({ size, symbol }: MappingProps) => JSX.Element> =
  {
    _UTXO: DFI,
    DFI,
    "DFI (UTXO)": DFI,
    "DFI (Token)": DFI,
    BTC,
    dBCH,
    dBTC,
    dDFI,
    dETH,
    dLTC,
    dUSDT,
    dUSDC,
    dUSD,
    DUSD: dUSD,
    DefaultToken,
  };

export function getTokenIcon(
  symbol: string
): (size: MappingProps) => JSX.Element {
  let Icon = mapping[symbol];
  if (Icon === undefined) {
    Icon = mapping.DefaultToken;
  }
  return Icon;
}
