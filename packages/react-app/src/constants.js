/* eslint-disable max-lines */
require('dotenv').config()

// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = process.env.REACT_APP_INFURA_ID || '7b0e75d38d424750b92791477924d133'

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = process.env.REACT_APP_ETHERSCAN_KEY || 'DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW'

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = process.env.REACT_APP_BLOCKNATIVE || '0b58206a-f3c0-4701-a62f-73c7243e8c77'

export const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY || 'oKxs-03sij-U_N0iOlrSsZFr29-IqbuF'

export const HOOK_OPTIONS = {
  blockNumberInterval: 5,
  query: { refetchOnWindowFocus: true },
}

export const NETWORKS = {
  localhost: {
    name: 'localhost',
    color: '#666666',
    chainId: 31337,
    blockExplorer: '',
    rpcUrl: `http://${global.window ? window.location.hostname : 'localhost'}:8545`,
  },
  mainnet: {
    name: 'mainnet',
    color: '#ff8b9e',
    chainId: 1,
    rpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    blockExplorer: 'https://etherscan.io/',
  },
  kovan: {
    name: 'kovan',
    color: '#7003DD',
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    blockExplorer: 'https://kovan.etherscan.io/',
    faucet: 'https://gitter.im/kovan-testnet/faucet', // https://faucet.kovan.network/
  },
  rinkeby: {
    name: 'rinkeby',
    color: '#e0d068',
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: 'https://faucet.rinkeby.io/',
    blockExplorer: 'https://rinkeby.etherscan.io/',
  },
  ropsten: {
    name: 'ropsten',
    color: '#F60D09',
    chainId: 3,
    faucet: 'https://faucet.ropsten.be/',
    blockExplorer: 'https://ropsten.etherscan.io/',
    rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
  },
  goerli: {
    name: 'goerli',
    color: '#0975F6',
    chainId: 5,
    faucet: 'https://goerli-faucet.slock.it/',
    blockExplorer: 'https://goerli.etherscan.io/',
    rpcUrl: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  },
  xdai: {
    name: 'xdai',
    color: '#48a9a6',
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: 'https://dai.poa.network',
    faucet: 'https://xdai-faucet.top/',
    blockExplorer: 'https://blockscout.com/poa/xdai/',
  },
  polygon: {
    name: 'polygon',
    color: '#2bbdf7',
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    // rpcUrl: process.env.REACT_APP_ALCHEMY_POLYGON ? 'https://polygon-mainnet.g.alchemy.com/v2/'+process.env.REACT_APP_ALCHEMY_POLYGON : 'https://polygon-rpc.com/',
    rpcUrl: 'https://polygon-rpc.com/',
    blockExplorer: 'https://polygonscan.com/',
  },
  mumbai: {
    name: 'mumbai',
    color: '#92D9FA',
    chainId: 80001,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: process.env.REACT_APP_ALCHEMY_MUMBAI
      ? `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_MUMBAI}`
      : 'https://rpc-mumbai.maticvigil.com',
    faucet: 'https://faucet.polygon.technology/',
    blockExplorer: 'https://mumbai.polygonscan.com/',
  },
}

export const NETWORK = chainId => {
  for (const n in NETWORKS) if (NETWORKS[n].chainId === chainId) return NETWORKS[n]
}

export const networkOptions = [NETWORKS.polygon.name, 'mainnet', 'rinkeby', 'goerli']

export const EmissionsPerCapitaCountries = {
  'AFG': {
    'Country': 'Afghanistan',
    'Year': 2020,
    'AnnualEmissions': 0.3124,
  },
  'ALB': {
    'Country': 'Albania',
    'Year': 2020,
    'AnnualEmissions': 1.5757,
  },
  'DZA': {
    'Country': 'Algeria',
    'Year': 2020,
    'AnnualEmissions': 3.5346,
  },
  'AND': {
    'Country': 'Andorra',
    'Year': 2020,
    'AnnualEmissions': 6.035,
  },
  'AGO': {
    'Country': 'Angola',
    'Year': 2020,
    'AnnualEmissions': 0.6754,
  },
  'AIA': {
    'Country': 'Anguilla',
    'Year': 2020,
    'AnnualEmissions': 8.2273,
  },
  'ATG': {
    'Country': 'Antigua and Barbuda',
    'Year': 2020,
    'AnnualEmissions': 4.3952,
  },
  'ARG': {
    'Country': 'Argentina',
    'Year': 2020,
    'AnnualEmissions': 3.4733,
  },
  'ARM': {
    'Country': 'Armenia',
    'Year': 2020,
    'AnnualEmissions': 1.9878,
  },
  'ABW': {
    'Country': 'Aruba',
    'Year': 2020,
    'AnnualEmissions': 7.0548,
  },
  'AUS': {
    'Country': 'Australia',
    'Year': 2020,
    'AnnualEmissions': 15.3684,
  },
  'AUT': {
    'Country': 'Austria',
    'Year': 2020,
    'AnnualEmissions': 6.7324,
  },
  'AZE': {
    'Country': 'Azerbaijan',
    'Year': 2020,
    'AnnualEmissions': 3.7203,
  },
  'BHS': {
    'Country': 'Bahamas',
    'Year': 2020,
    'AnnualEmissions': 5.9446,
  },
  'BHR': {
    'Country': 'Bahrain',
    'Year': 2020,
    'AnnualEmissions': 20.5456,
  },
  'BGD': {
    'Country': 'Bangladesh',
    'Year': 2020,
    'AnnualEmissions': 0.5637,
  },
  'BRB': {
    'Country': 'Barbados',
    'Year': 2020,
    'AnnualEmissions': 3.7817,
  },
  'BLR': {
    'Country': 'Belarus',
    'Year': 2020,
    'AnnualEmissions': 6.0793,
  },
  'BEL': {
    'Country': 'Belgium',
    'Year': 2020,
    'AnnualEmissions': 7.2262,
  },
  'BLZ': {
    'Country': 'Belize',
    'Year': 2020,
    'AnnualEmissions': 1.4657,
  },
  'BEN': {
    'Country': 'Benin',
    'Year': 2020,
    'AnnualEmissions': 0.5529,
  },
  'BMU': {
    'Country': 'Bermuda',
    'Year': 2020,
    'AnnualEmissions': 10.0276,
  },
  'BTN': {
    'Country': 'Bhutan',
    'Year': 2020,
    'AnnualEmissions': 2.4953,
  },
  'BOL': {
    'Country': 'Bolivia',
    'Year': 2020,
    'AnnualEmissions': 1.7733,
  },
  'BES': {
    'Country': 'Bonaire Sint Eustatius and Saba',
    'Year': 2020,
    'AnnualEmissions': 11.4662,
  },
  'BIH': {
    'Country': 'Bosnia and Herzegovina',
    'Year': 2020,
    'AnnualEmissions': 6.5282,
  },
  'BWA': {
    'Country': 'Botswana',
    'Year': 2020,
    'AnnualEmissions': 2.7721,
  },
  'BRA': {
    'Country': 'Brazil',
    'Year': 2020,
    'AnnualEmissions': 2.1988,
  },
  'VGB': {
    'Country': 'British Virgin Islands',
    'Year': 2020,
    'AnnualEmissions': 4.6053,
  },
  'BRN': {
    'Country': 'Brunei',
    'Year': 2020,
    'AnnualEmissions': 23.2203,
  },
  'BGR': {
    'Country': 'Bulgaria',
    'Year': 2020,
    'AnnualEmissions': 5.3888,
  },
  'BFA': {
    'Country': 'Burkina Faso',
    'Year': 2020,
    'AnnualEmissions': 0.1899,
  },
  'BDI': {
    'Country': 'Burundi',
    'Year': 2020,
    'AnnualEmissions': 0.0506,
  },
  'KHM': {
    'Country': 'Cambodia',
    'Year': 2020,
    'AnnualEmissions': 0.9167,
  },
  'CMR': {
    'Country': 'Cameroon',
    'Year': 2020,
    'AnnualEmissions': 0.2595,
  },
  'CAN': {
    'Country': 'Canada',
    'Year': 2020,
    'AnnualEmissions': 14.1969,
  },
  'CPV': {
    'Country': 'Cape Verde',
    'Year': 2020,
    'AnnualEmissions': 0.9891,
  },
  'CAF': {
    'Country': 'Central African Republic',
    'Year': 2020,
    'AnnualEmissions': 0.0389,
  },
  'TCD': {
    'Country': 'Chad',
    'Year': 2020,
    'AnnualEmissions': 0.0555,
  },
  'CHL': {
    'Country': 'Chile',
    'Year': 2020,
    'AnnualEmissions': 4.2462,
  },
  'CHN': {
    'Country': 'China',
    'Year': 2020,
    'AnnualEmissions': 7.4117,
  },
  'COL': {
    'Country': 'Colombia',
    'Year': 2020,
    'AnnualEmissions': 1.7512,
  },
  'COM': {
    'Country': 'Comoros',
    'Year': 2020,
    'AnnualEmissions': 0.2972,
  },
  'COG': {
    'Country': 'Congo',
    'Year': 2020,
    'AnnualEmissions': 0.5648,
  },
  'COK': {
    'Country': 'Cook Islands',
    'Year': 2020,
    'AnnualEmissions': 4.5219,
  },
  'CRI': {
    'Country': 'Costa Rica',
    'Year': 2020,
    'AnnualEmissions': 1.5523,
  },
  'CIV': {
    'Country': 'Cote d\'Ivoire',
    'Year': 2020,
    'AnnualEmissions': 0.3818,
  },
  'HRV': {
    'Country': 'Croatia',
    'Year': 2020,
    'AnnualEmissions': 4.1366,
  },
  'CUB': {
    'Country': 'Cuba',
    'Year': 2020,
    'AnnualEmissions': 1.7792,
  },
  'CUW': {
    'Country': 'Curacao',
    'Year': 2020,
    'AnnualEmissions': 20.3234,
  },
  'CYP': {
    'Country': 'Cyprus',
    'Year': 2020,
    'AnnualEmissions': 5.3805,
  },
  'CZE': {
    'Country': 'Czechia',
    'Year': 2020,
    'AnnualEmissions': 8.215,
  },
  'COD': {
    'Country': 'Democratic Republic of Congo',
    'Year': 2020,
    'AnnualEmissions': 0.0277,
  },
  'DNK': {
    'Country': 'Denmark',
    'Year': 2020,
    'AnnualEmissions': 4.5224,
  },
  'DJI': {
    'Country': 'Djibouti',
    'Year': 2020,
    'AnnualEmissions': 0.3557,
  },
  'DMA': {
    'Country': 'Dominica',
    'Year': 2020,
    'AnnualEmissions': 1.9343,
  },
  'DOM': {
    'Country': 'Dominican Republic',
    'Year': 2020,
    'AnnualEmissions': 2.5599,
  },
  'ECU': {
    'Country': 'Ecuador',
    'Year': 2020,
    'AnnualEmissions': 1.7532,
  },
  'EGY': {
    'Country': 'Egypt',
    'Year': 2020,
    'AnnualEmissions': 2.0859,
  },
  'SLV': {
    'Country': 'El Salvador',
    'Year': 2020,
    'AnnualEmissions': 0.9441,
  },
  'GNQ': {
    'Country': 'Equatorial Guinea',
    'Year': 2020,
    'AnnualEmissions': 7.3167,
  },
  'ERI': {
    'Country': 'Eritrea',
    'Year': 2020,
    'AnnualEmissions': 0.2037,
  },
  'EST': {
    'Country': 'Estonia',
    'Year': 2020,
    'AnnualEmissions': 7.8795,
  },
  'SWZ': {
    'Country': 'Eswatini',
    'Year': 2020,
    'AnnualEmissions': 0.8238,
  },
  'ETH': {
    'Country': 'Ethiopia',
    'Year': 2020,
    'AnnualEmissions': 0.1276,
  },
  'FRO': {
    'Country': 'Faeroe Islands',
    'Year': 2020,
    'AnnualEmissions': 13.9957,
  },
  'FJI': {
    'Country': 'Fiji',
    'Year': 2020,
    'AnnualEmissions': 1.5544,
  },
  'FIN': {
    'Country': 'Finland',
    'Year': 2020,
    'AnnualEmissions': 7.0907,
  },
  'FRA': {
    'Country': 'France',
    'Year': 2020,
    'AnnualEmissions': 4.2381,
  },
  'GUF': {
    'Country': 'French Guiana',
    'Year': 2020,
    'AnnualEmissions': 2.4386,
  },
  'PYF': {
    'Country': 'French Polynesia',
    'Year': 2020,
    'AnnualEmissions': 2.9486,
  },
  'GAB': {
    'Country': 'Gabon',
    'Year': 2020,
    'AnnualEmissions': 1.9311,
  },
  'GMB': {
    'Country': 'Gambia',
    'Year': 2020,
    'AnnualEmissions': 0.2069,
  },
  'GEO': {
    'Country': 'Georgia',
    'Year': 2020,
    'AnnualEmissions': 2.4988,
  },
  'DEU': {
    'Country': 'Germany',
    'Year': 2020,
    'AnnualEmissions': 7.6901,
  },
  'GHA': {
    'Country': 'Ghana',
    'Year': 2020,
    'AnnualEmissions': 0.515,
  },
  'GRC': {
    'Country': 'Greece',
    'Year': 2020,
    'AnnualEmissions': 5.0115,
  },
  'GRL': {
    'Country': 'Greenland',
    'Year': 2020,
    'AnnualEmissions': 9.061,
  },
  'GRD': {
    'Country': 'Grenada',
    'Year': 2020,
    'AnnualEmissions': 2.6203,
  },
  'GLP': {
    'Country': 'Guadeloupe',
    'Year': 2020,
    'AnnualEmissions': 6.4027,
  },
  'GTM': {
    'Country': 'Guatemala',
    'Year': 2020,
    'AnnualEmissions': 1.0571,
  },
  'GIN': {
    'Country': 'Guinea',
    'Year': 2020,
    'AnnualEmissions': 0.2584,
  },
  'GNB': {
    'Country': 'Guinea-Bissau',
    'Year': 2020,
    'AnnualEmissions': 0.1457,
  },
  'GUY': {
    'Country': 'Guyana',
    'Year': 2020,
    'AnnualEmissions': 2.8131,
  },
  'HTI': {
    'Country': 'Haiti',
    'Year': 2020,
    'AnnualEmissions': 0.256,
  },
  'HND': {
    'Country': 'Honduras',
    'Year': 2020,
    'AnnualEmissions': 0.9753,
  },
  'HKG': {
    'Country': 'Hong Kong',
    'Year': 2020,
    'AnnualEmissions': 4.1668,
  },
  'HUN': {
    'Country': 'Hungary',
    'Year': 2020,
    'AnnualEmissions': 4.9973,
  },
  'ISL': {
    'Country': 'Iceland',
    'Year': 2020,
    'AnnualEmissions': 8.6036,
  },
  'IND': {
    'Country': 'India',
    'Year': 2020,
    'AnnualEmissions': 1.7694,
  },
  'IDN': {
    'Country': 'Indonesia',
    'Year': 2020,
    'AnnualEmissions': 2.1552,
  },
  'IRN': {
    'Country': 'Iran',
    'Year': 2020,
    'AnnualEmissions': 8.8702,
  },
  'IRQ': {
    'Country': 'Iraq',
    'Year': 2020,
    'AnnualEmissions': 5.2416,
  },
  'IRL': {
    'Country': 'Ireland',
    'Year': 2020,
    'AnnualEmissions': 6.7538,
  },
  'ISR': {
    'Country': 'Israel',
    'Year': 2020,
    'AnnualEmissions': 6.5104,
  },
  'ITA': {
    'Country': 'Italy',
    'Year': 2020,
    'AnnualEmissions': 5.0249,
  },
  'JAM': {
    'Country': 'Jamaica',
    'Year': 2020,
    'AnnualEmissions': 2.509,
  },
  'JPN': {
    'Country': 'Japan',
    'Year': 2020,
    'AnnualEmissions': 8.1499,
  },
  'JOR': {
    'Country': 'Jordan',
    'Year': 2020,
    'AnnualEmissions': 2.498,
  },
  'KAZ': {
    'Country': 'Kazakhstan',
    'Year': 2020,
    'AnnualEmissions': 15.5158,
  },
  'KEN': {
    'Country': 'Kenya',
    'Year': 2020,
    'AnnualEmissions': 0.3003,
  },
  'KIR': {
    'Country': 'Kiribati',
    'Year': 2020,
    'AnnualEmissions': 0.5699,
  },
  'KWT': {
    'Country': 'Kuwait',
    'Year': 2020,
    'AnnualEmissions': 20.8251,
  },
  'KGZ': {
    'Country': 'Kyrgyzstan',
    'Year': 2020,
    'AnnualEmissions': 1.7639,
  },
  'LAO': {
    'Country': 'Laos',
    'Year': 2020,
    'AnnualEmissions': 4.6521,
  },
  'LVA': {
    'Country': 'Latvia',
    'Year': 2020,
    'AnnualEmissions': 3.5907,
  },
  'LBN': {
    'Country': 'Lebanon',
    'Year': 2020,
    'AnnualEmissions': 3.8048,
  },
  'LSO': {
    'Country': 'Lesotho',
    'Year': 2020,
    'AnnualEmissions': 1.0192,
  },
  'LBR': {
    'Country': 'Liberia',
    'Year': 2020,
    'AnnualEmissions': 0.1995,
  },
  'LBY': {
    'Country': 'Libya',
    'Year': 2020,
    'AnnualEmissions': 7.3815,
  },
  'LIE': {
    'Country': 'Liechtenstein',
    'Year': 2020,
    'AnnualEmissions': 3.6975,
  },
  'LTU': {
    'Country': 'Lithuania',
    'Year': 2020,
    'AnnualEmissions': 5.0691,
  },
  'LUX': {
    'Country': 'Luxembourg',
    'Year': 2020,
    'AnnualEmissions': 13.059,
  },
  'MAC': {
    'Country': 'Macao',
    'Year': 2020,
    'AnnualEmissions': 1.9447,
  },
  'MDG': {
    'Country': 'Madagascar',
    'Year': 2020,
    'AnnualEmissions': 0.1329,
  },
  'MWI': {
    'Country': 'Malawi',
    'Year': 2020,
    'AnnualEmissions': 0.0729,
  },
  'MYS': {
    'Country': 'Malaysia',
    'Year': 2020,
    'AnnualEmissions': 8.4226,
  },
  'MDV': {
    'Country': 'Maldives',
    'Year': 2020,
    'AnnualEmissions': 3.3235,
  },
  'MLI': {
    'Country': 'Mali',
    'Year': 2020,
    'AnnualEmissions': 0.1674,
  },
  'MLT': {
    'Country': 'Malta',
    'Year': 2020,
    'AnnualEmissions': 3.6121,
  },
  'MHL': {
    'Country': 'Marshall Islands',
    'Year': 2020,
    'AnnualEmissions': 2.5557,
  },
  'MTQ': {
    'Country': 'Martinique',
    'Year': 2020,
    'AnnualEmissions': 6.258,
  },
  'MRT': {
    'Country': 'Mauritania',
    'Year': 2020,
    'AnnualEmissions': 0.7263,
  },
  'MUS': {
    'Country': 'Mauritius',
    'Year': 2020,
    'AnnualEmissions': 3.129,
  },
  'MYT': {
    'Country': 'Mayotte',
    'Year': 2020,
    'AnnualEmissions': 1.1201,
  },
  'MEX': {
    'Country': 'Mexico',
    'Year': 2020,
    'AnnualEmissions': 2.7686,
  },
  'MDA': {
    'Country': 'Moldova',
    'Year': 2020,
    'AnnualEmissions': 1.2759,
  },
  'MNG': {
    'Country': 'Mongolia',
    'Year': 2020,
    'AnnualEmissions': 26.978,
  },
  'MNE': {
    'Country': 'Montenegro',
    'Year': 2020,
    'AnnualEmissions': 3.6778,
  },
  'MSR': {
    'Country': 'Montserrat',
    'Year': 2020,
    'AnnualEmissions': 5.0646,
  },
  'MAR': {
    'Country': 'Morocco',
    'Year': 2020,
    'AnnualEmissions': 1.7484,
  },
  'MOZ': {
    'Country': 'Mozambique',
    'Year': 2020,
    'AnnualEmissions': 0.2102,
  },
  'MMR': {
    'Country': 'Myanmar',
    'Year': 2020,
    'AnnualEmissions': 0.6676,
  },
  'NAM': {
    'Country': 'Namibia',
    'Year': 2020,
    'AnnualEmissions': 1.5259,
  },
  'NRU': {
    'Country': 'Nauru',
    'Year': 2020,
    'AnnualEmissions': 5.2364,
  },
  'NPL': {
    'Country': 'Nepal',
    'Year': 2020,
    'AnnualEmissions': 0.582,
  },
  'NLD': {
    'Country': 'Netherlands',
    'Year': 2020,
    'AnnualEmissions': 8.0596,
  },
  'NCL': {
    'Country': 'New Caledonia',
    'Year': 2020,
    'AnnualEmissions': 30.4482,
  },
  'NZL': {
    'Country': 'New Zealand',
    'Year': 2020,
    'AnnualEmissions': 6.9418,
  },
  'NIC': {
    'Country': 'Nicaragua',
    'Year': 2020,
    'AnnualEmissions': 0.7659,
  },
  'NER': {
    'Country': 'Niger',
    'Year': 2020,
    'AnnualEmissions': 0.0698,
  },
  'NGA': {
    'Country': 'Nigeria',
    'Year': 2020,
    'AnnualEmissions': 0.6086,
  },
  'NIU': {
    'Country': 'Niue',
    'Year': 2020,
    'AnnualEmissions': 7.0124,
  },
  'PRK': {
    'Country': 'North Korea',
    'Year': 2020,
    'AnnualEmissions': 1.137,
  },
  'MKD': {
    'Country': 'North Macedonia',
    'Year': 2020,
    'AnnualEmissions': 3.4302,
  },
  'NOR': {
    'Country': 'Norway',
    'Year': 2020,
    'AnnualEmissions': 7.615,
  },
  'OMN': {
    'Country': 'Oman',
    'Year': 2020,
    'AnnualEmissions': 12.1729,
  },
  'PAK': {
    'Country': 'Pakistan',
    'Year': 2020,
    'AnnualEmissions': 1.0628,
  },
  'PLW': {
    'Country': 'Palau',
    'Year': 2020,
    'AnnualEmissions': 12.1246,
  },
  'PSE': {
    'Country': 'Palestine',
    'Year': 2020,
    'AnnualEmissions': 0.5682,
  },
  'PAN': {
    'Country': 'Panama',
    'Year': 2020,
    'AnnualEmissions': 2.4983,
  },
  'PNG': {
    'Country': 'Papua New Guinea',
    'Year': 2020,
    'AnnualEmissions': 0.7435,
  },
  'PRY': {
    'Country': 'Paraguay',
    'Year': 2020,
    'AnnualEmissions': 1.0613,
  },
  'PER': {
    'Country': 'Peru',
    'Year': 2020,
    'AnnualEmissions': 1.3559,
  },
  'PHL': {
    'Country': 'Philippines',
    'Year': 2020,
    'AnnualEmissions': 1.2413,
  },
  'POL': {
    'Country': 'Poland',
    'Year': 2020,
    'AnnualEmissions': 7.916,
  },
  'PRT': {
    'Country': 'Portugal',
    'Year': 2020,
    'AnnualEmissions': 3.9609,
  },
  'PRI': {
    'Country': 'Puerto Rico',
    'Year': 1920,
    'AnnualEmissions': 0.1453,
  },
  'QAT': {
    'Country': 'Qatar',
    'Year': 2020,
    'AnnualEmissions': 37.0193,
  },
  'REU': {
    'Country': 'Reunion',
    'Year': 2020,
    'AnnualEmissions': 5.1244,
  },
  'ROU': {
    'Country': 'Romania',
    'Year': 2020,
    'AnnualEmissions': 3.7154,
  },
  'RUS': {
    'Country': 'Russia',
    'Year': 2020,
    'AnnualEmissions': 10.8072,
  },
  'RWA': {
    'Country': 'Rwanda',
    'Year': 2020,
    'AnnualEmissions': 0.0797,
  },
  'SHN': {
    'Country': 'Saint Helena',
    'Year': 2020,
    'AnnualEmissions': 1.5638,
  },
  'KNA': {
    'Country': 'Saint Kitts and Nevis',
    'Year': 2020,
    'AnnualEmissions': 3.9863,
  },
  'LCA': {
    'Country': 'Saint Lucia',
    'Year': 2020,
    'AnnualEmissions': 2.3956,
  },
  'SPM': {
    'Country': 'Saint Pierre and Miquelon',
    'Year': 2020,
    'AnnualEmissions': 8.7379,
  },
  'VCT': {
    'Country': 'Saint Vincent and the Grenadines',
    'Year': 2020,
    'AnnualEmissions': 1.8827,
  },
  'WSM': {
    'Country': 'Samoa',
    'Year': 2020,
    'AnnualEmissions': 1.239,
  },
  'STP': {
    'Country': 'Sao Tome and Principe',
    'Year': 2020,
    'AnnualEmissions': 0.5144,
  },
  'SAU': {
    'Country': 'Saudi Arabia',
    'Year': 2020,
    'AnnualEmissions': 17.9672,
  },
  'SEN': {
    'Country': 'Senegal',
    'Year': 2020,
    'AnnualEmissions': 0.6242,
  },
  'SRB': {
    'Country': 'Serbia',
    'Year': 2020,
    'AnnualEmissions': 4.9369,
  },
  'SYC': {
    'Country': 'Seychelles',
    'Year': 2020,
    'AnnualEmissions': 4.9936,
  },
  'SLE': {
    'Country': 'Sierra Leone',
    'Year': 2020,
    'AnnualEmissions': 0.11,
  },
  'SGP': {
    'Country': 'Singapore',
    'Year': 2020,
    'AnnualEmissions': 7.778,
  },
  'SXM': {
    'Country': 'Sint Maarten (Dutch part)',
    'Year': 2020,
    'AnnualEmissions': 14.539,
  },
  'SVK': {
    'Country': 'Slovakia',
    'Year': 2020,
    'AnnualEmissions': 5.6286,
  },
  'SVN': {
    'Country': 'Slovenia',
    'Year': 2020,
    'AnnualEmissions': 6.043,
  },
  'SLB': {
    'Country': 'Solomon Islands',
    'Year': 2020,
    'AnnualEmissions': 0.435,
  },
  'SOM': {
    'Country': 'Somalia',
    'Year': 2020,
    'AnnualEmissions': 0.0354,
  },
  'ZAF': {
    'Country': 'South Africa',
    'Year': 2020,
    'AnnualEmissions': 7.6204,
  },
  'KOR': {
    'Country': 'South Korea',
    'Year': 2020,
    'AnnualEmissions': 11.6562,
  },
  'SSD': {
    'Country': 'South Sudan',
    'Year': 2020,
    'AnnualEmissions': 0.1053,
  },
  'ESP': {
    'Country': 'Spain',
    'Year': 2020,
    'AnnualEmissions': 4.4683,
  },
  'LKA': {
    'Country': 'Sri Lanka',
    'Year': 2020,
    'AnnualEmissions': 0.9857,
  },
  'SDN': {
    'Country': 'Sudan',
    'Year': 2020,
    'AnnualEmissions': 0.4301,
  },
  'SUR': {
    'Country': 'Suriname',
    'Year': 2020,
    'AnnualEmissions': 3.7914,
  },
  'SWE': {
    'Country': 'Sweden',
    'Year': 2020,
    'AnnualEmissions': 3.8255,
  },
  'CHE': {
    'Country': 'Switzerland',
    'Year': 2020,
    'AnnualEmissions': 3.7319,
  },
  'SYR': {
    'Country': 'Syria',
    'Year': 2020,
    'AnnualEmissions': 1.7446,
  },
  'TWN': {
    'Country': 'Taiwan',
    'Year': 2020,
    'AnnualEmissions': 11.4698,
  },
  'TJK': {
    'Country': 'Tajikistan',
    'Year': 2020,
    'AnnualEmissions': 0.9906,
  },
  'TZA': {
    'Country': 'Tanzania',
    'Year': 2020,
    'AnnualEmissions': 0.1831,
  },
  'THA': {
    'Country': 'Thailand',
    'Year': 2020,
    'AnnualEmissions': 3.6929,
  },
  'TLS': {
    'Country': 'Timor',
    'Year': 2020,
    'AnnualEmissions': 0.3987,
  },
  'TGO': {
    'Country': 'Togo',
    'Year': 2020,
    'AnnualEmissions': 0.2647,
  },
  'TON': {
    'Country': 'Tonga',
    'Year': 2020,
    'AnnualEmissions': 1.3597,
  },
  'TTO': {
    'Country': 'Trinidad and Tobago',
    'Year': 2020,
    'AnnualEmissions': 25.3731,
  },
  'TUN': {
    'Country': 'Tunisia',
    'Year': 2020,
    'AnnualEmissions': 2.3799,
  },
  'TUR': {
    'Country': 'Turkey',
    'Year': 2020,
    'AnnualEmissions': 4.6573,
  },
  'TKM': {
    'Country': 'Turkmenistan',
    'Year': 2020,
    'AnnualEmissions': 12.4914,
  },
  'TCA': {
    'Country': 'Turks and Caicos Islands',
    'Year': 2020,
    'AnnualEmissions': 5.2313,
  },
  'TUV': {
    'Country': 'Tuvalu',
    'Year': 2020,
    'AnnualEmissions': 0.6415,
  },
  'UGA': {
    'Country': 'Uganda',
    'Year': 2020,
    'AnnualEmissions': 0.107,
  },
  'UKR': {
    'Country': 'Ukraine',
    'Year': 2020,
    'AnnualEmissions': 4.8912,
  },
  'ARE': {
    'Country': 'United Arab Emirates',
    'Year': 2020,
    'AnnualEmissions': 15.1933,
  },
  'GBR': {
    'Country': 'United Kingdom',
    'Year': 2020,
    'AnnualEmissions': 4.8549,
  },
  'USA': {
    'Country': 'United States',
    'Year': 2020,
    'AnnualEmissions': 14.2379,
  },
  'URY': {
    'Country': 'Uruguay',
    'Year': 2020,
    'AnnualEmissions': 1.6812,
  },
  'UZB': {
    'Country': 'Uzbekistan',
    'Year': 2020,
    'AnnualEmissions': 3.3698,
  },
  'VUT': {
    'Country': 'Vanuatu',
    'Year': 2020,
    'AnnualEmissions': 0.591,
  },
  'VEN': {
    'Country': 'Venezuela',
    'Year': 2020,
    'AnnualEmissions': 2.9754,
  },
  'VNM': {
    'Country': 'Vietnam',
    'Year': 2020,
    'AnnualEmissions': 2.6126,
  },
  'OWID_WRL': {
    'Country': 'World',
    'Year': 2020,
    'AnnualEmissions': 4.4654,
  },
  'YEM': {
    'Country': 'Yemen',
    'Year': 2020,
    'AnnualEmissions': 0.3275,
  },
  'ZMB': {
    'Country': 'Zambia',
    'Year': 2020,
    'AnnualEmissions': 0.3575,
  },
  'ZWE': {
    'Country': 'Zimbabwe',
    'Year': 2020,
    'AnnualEmissions': 0.7086,
  },
}
