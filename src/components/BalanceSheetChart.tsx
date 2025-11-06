import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Slider } from "./ui/slider";
import { Card } from "./ui/card";
import { Bitcoin, PoundSterling } from "lucide-react";

// Mock data representing portfolio performance from 2020-2025
const generateData = (bitcoinPercentage: number) => {
  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
  
  // Cash performance (declining trend due to inflation)
  const cashValues = [1.0, 0.98, 0.95, 0.88, 0.82, 0.78];
  
  // Top interest rate performance (moderate decline)
  const interestValues = [1.0, 1.0, 0.98, 0.95, 0.92, 0.90];
  
  // Bitcoin performance (volatile but strong growth - ~790% over 5 years)
  const bitcoinValues = [1.0, 3.5, 2.1, 4.2, 7.0, 8.9];
  
  return years.map((year, index) => {
    const interestPercentage = 100 - bitcoinPercentage;
    const mixedValue = (interestValues[index] * interestPercentage / 100) + (bitcoinValues[index] * bitcoinPercentage / 100);
    
    return {
      year,
      cash: cashValues[index],
      topInterest: interestValues[index],
      mixed: mixedValue,
    };
  });
};

const calculateReturn = (data: any[], key: string) => {
  const firstValue = data[0][key];
  const lastValue = data[data.length - 1][key];
  return ((lastValue - firstValue) / firstValue * 100).toFixed(1);
};

export function BalanceSheetChart() {
  const [bitcoinPercentage, setBitcoinPercentage] = useState(5);
  const data = generateData(bitcoinPercentage);
  const cashPercentage = 100 - bitcoinPercentage;
  
  const cashReturn = calculateReturn(data, 'cash');
  const interestReturn = calculateReturn(data, 'topInterest');
  const mixedReturn = calculateReturn(data, 'mixed');

  return (
    <Card className="p-8 shadow-xl">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="mb-4">PROTECT YOUR BALANCE SHEET</h1>
          <div className="h-px bg-black mb-6" />
          
          {/* Legend */}
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black" />
              <span>Cash</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-400" />
              <span>Top Interest Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-600" />
              <span>{100 - bitcoinPercentage}% Interest, {bitcoinPercentage}% Bitcoin</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 100, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                domain={[0.6, 'auto']}
                label={{ value: 'Value of £1', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
                formatter={(value: any) => `£${Number(value).toFixed(2)}`}
              />
              <Line 
                type="monotone" 
                dataKey="cash" 
                stroke="#000000" 
                strokeWidth={3}
                name="Cash"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="topInterest" 
                stroke="#9ca3af" 
                strokeWidth={3}
                name="Top Interest Rate"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="mixed" 
                stroke="#ea580c" 
                strokeWidth={3}
                name={`${100 - bitcoinPercentage}% Interest, ${bitcoinPercentage}% Bitcoin`}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-black text-white rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <PoundSterling className="w-5 h-5" />
              <span>Cash</span>
            </div>
            <div className="text-2xl">{cashReturn}%</div>
          </div>
          <div className="p-4 bg-gray-400 text-white rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <PoundSterling className="w-5 h-5" />
              <span>Top Interest Rate</span>
            </div>
            <div className="text-2xl">{interestReturn}%</div>
          </div>
          <div className="p-4 bg-orange-600 text-white rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bitcoin className="w-5 h-5" />
              <span>{cashPercentage}% Interest, {bitcoinPercentage}% Bitcoin</span>
            </div>
            <div className="text-2xl">{mixedReturn}%</div>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-8 rounded-xl border-2 border-orange-200">
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Adjust Your Bitcoin Allocation</h2>
              <p className="text-gray-600">Use the slider below to see how different Bitcoin percentages affect your portfolio performance</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bitcoin className="w-6 h-6 text-orange-600" />
                  <span className="text-gray-700">Bitcoin</span>
                </div>
                <span className="text-3xl text-orange-600">{bitcoinPercentage}%</span>
              </div>
              
              <Slider
                value={[bitcoinPercentage]}
                onValueChange={(value) => setBitcoinPercentage(value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <PoundSterling className="w-6 h-6 text-gray-600" />
                  <span className="text-gray-700">Interest-Bearing Assets</span>
                </div>
                <span className="text-3xl text-gray-600">{cashPercentage}%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-orange-300">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Projected Return (2020-2025)</span>
                <span className={`text-3xl ${Number(mixedReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(mixedReturn) >= 0 ? '+' : ''}{mixedReturn}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-sm text-gray-500 text-center">
          <p>This is a simplified illustration based on historical data. Past performance does not guarantee future results.</p>
          <p>Always consult with a financial advisor before making investment decisions.</p>
        </div>
      </div>
    </Card>
  );
}
