import React, { useState, type ChangeEvent } from 'react';
import styles from './IMCCalculator.module.css';

// Função para calcular o IMC (lógica separada)
const calculateIMC = (heightCm: number, weightKg: number): number => {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Altura e peso devem ser números positivos.');
  }
  const heightMeters = heightCm / 100; // Converter cm para metros
  return weightKg / (heightMeters * heightMeters);
};

const IMCCalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [imc, setImc] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setter(value);
      setImc(null); // Limpa o IMC ao digitar
      setError(null); // Limpa o erro ao digitar
    } else if (parseFloat(value) < 0) {
        setError('Valores não podem ser negativos.');
        setImc(null);
    }
  };

  const handleCalculateClick = () => {
    setError(null);
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);

    if (isNaN(parsedHeight) || isNaN(parsedWeight) || parsedHeight <= 0 || parsedWeight <= 0) {
      setError('Por favor, insira valores numéricos válidos e positivos para altura e peso.');
      setImc(null);
      return;
    }

    try {
      const calculatedImc = calculateIMC(parsedHeight, parsedWeight);
      setImc(parseFloat(calculatedImc.toFixed(1)));
    } catch (err: any) {
      console.error("Erro ao calcular IMC:", err.message);
      setError(err.message);
      setImc(null);
    }
  };

  const isCalculateButtonDisabled = !(
    height &&
    weight &&
    !isNaN(parseFloat(height)) &&
    !isNaN(parseFloat(weight)) &&
    parseFloat(height) > 0 &&
    parseFloat(weight) > 0
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>CALCULADORA DE IMC</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="height">Altura (cm)</label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => handleInputChange(e, setHeight)}
            placeholder="Ex: 170"
            min="0"
            step="0.1"
            aria-describedby="height-error"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="weight">Peso (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => handleInputChange(e, setWeight)}
            placeholder="Ex: 70"
            min="0"
            step="0.1"
            aria-describedby="weight-error"
          />
        </div>

        {error && <p className={styles.errorMessage} role="alert">{error}</p>}

        <button
          className={styles.calculateButton}
          onClick={handleCalculateClick}
          disabled={isCalculateButtonDisabled}
        >
          Calcular IMC
        </button>

        {imc !== null && (
          <p className={styles.result}>Seu IMC é {imc.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
        )}
      </div>

      <div className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Calculadora de IMC. Todos os direitos reservados a xirvo.</p>
      </div>
    </div>
  );
};

export default IMCCalculator;