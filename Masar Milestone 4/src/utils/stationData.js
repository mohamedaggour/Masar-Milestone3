// Cairo Metro Line Stations
export const LINE_1_STATIONS = [
  'Helwan', 'Ain Helwan', 'Helwan University', 'Wadi Hof', 'Hadayek Helwan', 'El-Maasara',
  'Tora El-Asmant', 'Kozzika', 'Tora El-Balad', 'Sakanat El-Maadi', 'Maadi', 'Hadayek El-Maadi',
  'Dar El-Salam', 'El-Zahraa', 'Mar Girgis', 'El-Malek El-Saleh', 'Al-Sayeda Zeinab',
  'Saad Zaghloul', 'Nasser', 'Orabi', 'Al-Shohadaa', 'Ghamra', 'El-Demerdash', 'Manshiet El-Sadr',
  'Kobri El-Qobba', 'Hammamat El-Qobba', 'Saray El-Qobba', 'Hadayeq El-Zaitoun', 'Helmeyet El-Zaitoun',
  'El-Matareyya', 'Ain Shams', 'Ezbet El-Nakhl', 'El-Marg', 'New El-Marg'
];

export const LINE_2_STATIONS = [
  'Shubra El Kheima', 'Kolleyyet El-Zeraa', 'Mezallat', 'Khalafawy', 'St. Teresa', 'Rod El Farag',
  'Massara', 'Al-Shohadaa', 'Attaba', 'Mohamed Naguib', 'Sadat', 'Opera', 'Dokki', 'El Bohooth',
  'Cairo University', 'Faisal', 'Giza', 'Omm El Misryeen', 'Sakiat Mekki', 'El Monib'
];

export const LINE_3_STATIONS = [
  'Adly Mansour', 'El Haykestep', 'Omar Ibn El-Khattab', 'Qubbah', 'Hesham Barakat', 'El Nozha',
  'Nadi El Shams', 'Alf Maskan', 'Heliopolis Square', 'Haroun', 'Al-Ahram', 'Koleyet El Banat',
  'Stadium', 'Fair Zone', 'Abbassia', 'Abdou Pasha', 'El Geish', 'Bab El Shaaria', 'Attaba',
  'Nasser', 'Maspero', 'Zamalek', 'Kit Kat', 'Sudan', 'Imbaba', 'Wadi El Nile', 'Ring Road', 'Rod El Farag'
];

export const CAIRO_METRO_STATIONS = [...new Set([...LINE_1_STATIONS, ...LINE_2_STATIONS, ...LINE_3_STATIONS])];

export const EGYPT_RAIL_STATIONS = [
  'Ramses Station', 'Giza Station', 'Alexandria (Sidi Gaber)', 'Tanta', 'Mansoura', 'Zagazig',
  'Damanhour', 'Kafr El-Sheikh', 'Sohag', 'Qena', 'Luxor', 'Aswan',
  'Beni Suef', 'Minya', 'Fayoum', 'Ismailia', 'Port Said', 'Suez', 'Damietta', 'Mersa Matruh', 'Arish'
];

export const ALL_STATIONS = [...new Set([...CAIRO_METRO_STATIONS, ...EGYPT_RAIL_STATIONS])];

export const getStationLine = (station) => {
  if (station === 'Al-Shohadaa') return [1, 2];
  if (station === 'Attaba') return [2, 3];
  if (station === 'Nasser') return [1, 3];
  if (station === 'Rod El Farag') return [2, 3];
  if (LINE_1_STATIONS.includes(station)) return 1;
  if (LINE_2_STATIONS.includes(station)) return 2;
  if (LINE_3_STATIONS.includes(station)) return 3;
  return null;
};

export const calculatePrice = (from, to) => {
  if (EGYPT_RAIL_STATIONS.includes(from) && EGYPT_RAIL_STATIONS.includes(to)) {
    const idxFrom = EGYPT_RAIL_STATIONS.indexOf(from);
    const idxTo = EGYPT_RAIL_STATIONS.indexOf(to);
    const distanceFactor = Math.abs(idxTo - idxFrom);
    return Math.min(300, 30 + distanceFactor * 10);
  }

  if (EGYPT_RAIL_STATIONS.includes(from) && CAIRO_METRO_STATIONS.includes(to)) {
    const intercityFare = calculatePrice(from, 'Ramses Station');
    const metroFare = calculatePrice('Sadat', to);
    return intercityFare + metroFare;
  }

  if (CAIRO_METRO_STATIONS.includes(from) && EGYPT_RAIL_STATIONS.includes(to)) {
    const metroFare = calculatePrice(from, 'Sadat');
    const intercityFare = calculatePrice('Ramses Station', to);
    return metroFare + intercityFare;
  }

  if (CAIRO_METRO_STATIONS.includes(from) && CAIRO_METRO_STATIONS.includes(to)) {
    const fromLine = getStationLine(from);
    const toLine = getStationLine(to);
    const isSameLine = Array.isArray(fromLine) ? toLine === fromLine : fromLine === toLine;
    const idxFrom = CAIRO_METRO_STATIONS.indexOf(from);
    const idxTo = CAIRO_METRO_STATIONS.indexOf(to);
    const baseDistance = Math.abs(idxTo - idxFrom);
    const basePrice = isSameLine ? 2 : 3;
    return Math.min(7, basePrice + Math.floor(baseDistance / 5));
  }

  return 5;
};

export const calculateDuration = (from, to) => {
  const distance = Math.abs(CAIRO_METRO_STATIONS.indexOf(to) - CAIRO_METRO_STATIONS.indexOf(from));
  return Math.max(5, Math.floor(distance / 2));
};

export const getRoute = (from, to) => {
  const fromLine = getStationLine(from);
  const toLine = getStationLine(to);
  if (fromLine === toLine || (Array.isArray(fromLine) && toLine === fromLine) || (Array.isArray(toLine) && fromLine === toLine)) {
    return `Line ${fromLine} direct`;
  }
  return 'Transfer required';
};
