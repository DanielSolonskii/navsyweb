            /**
             * Возвращает единицу измерения с правильным окончанием
             * 
             * @param {Number} num      Число
             * @param {String} curCase   Еденица измерения времени ('mm'/'dd'/'hh')
             * @return {String}            
             */
          export default function  units(num, curCase) {
              const hhCases = {nom: 'час', gen: 'часа', plu: 'часов'};
              const mmCases = {nom: 'минута', gen: 'минут', plu: 'минут'};
              const ddCases = {nom: 'день', gen: 'дня', plu: 'дней'};
              let cases = '';
              switch (curCase) {
                case 'mm':
                    cases = mmCases
                    break;
                case 'hh':
                    cases = hhCases
                    break;
                case 'dd':
                    cases = ddCases
                    break;
            }

                num = Math.abs(num);

                let word = '';

                if (num.toString().indexOf('.') > -1) {
                    word = cases.gen;
                } else {
                    word = (
                        num % 10 == 1 && num % 100 != 11 ?
                        cases.nom :
                        num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ?
                        cases.gen :
                        cases.plu
                    );
                }

                return word;
            }
