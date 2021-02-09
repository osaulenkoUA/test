import employees from '../data/employees.json';
import recipes from '../data/recipes.json';
import prices from '../data/prices.json';

//Створюємо масив з назвами напоїв
const arrDrinks = Object.keys(recipes);

//створюємо масив arrCostDrinks з об`єктами - назва напою : ціна напою
const arrCostDrinks = arrDrinks.map(el => {
  //---ціна кофе для кожного напою
  const costCoffee =
    recipes[el].coffee === undefined
      ? 0
      : (recipes[el].coffee * prices.coffee).toFixed(3);

  //---ціна води для кожного напою
  const costWater =
    recipes[el].water === undefined
      ? 0
      : (recipes[el].water * prices.water).toFixed(3);

  //---ціна молока для кожного напою
  const costMilk =
    recipes[el].milk === undefined
      ? 0
      : (recipes[el].milk * prices.milk).toFixed(3);

  //---додаємо ціну кофе,ціну молока, ціну води для кожного напою
  const costProduct = +(
    Number(costCoffee) +
    Number(costWater) +
    Number(costMilk)
  ).toFixed(3);

  return {
    [el]: costProduct, //---повертаємо об'єкт з назва напою : ціна напою
  };
});

//фунція invited повертає масив з employees that should be invited
function invited(m) {
  let budget = m;

  //створюємо новий масив з об'єктами employee кожен якого додатково містить
  //поле з сумою/вартістю всіх напоїв
  const employeesWithSummDrinks = employees.map(el => {
    //--- costCurrentDrink- масив з вартістю напоїв для конкретного робітника
    const costCurrentDrink = el.drinks.map(drink => {
      const arr = arrCostDrinks.map(el => {
        if (el.hasOwnProperty(drink)) return el[drink]; //перевірка чи є з загального списку напоїв-напій робітника
        return 0;
      });
      return summ(arr); //---summ функція для сумування елементів масиву
    });
    return { ...el, summDrinks: costCurrentDrink }; //добавляє в об'єкт поле  summDrinks вартість напою/напоїв (може бути масив з декількох елементів)
  });

  //наступні дві стрічки коду дають змогу запросити на вечірку робітників з найдешевшим у їхньому
  //списку напоїв.В умові задачі не вказано якому напою зі списку(якщо напоїв більше 1) віддає перевагу робітник.І щоб
  //запросити найбільше людей потрібно вибрати найдешевший напій зі списку.Наприклад з бюджетом 0.88
  // можна запросити 9 робітників.При видалені цих двух стрічок коду - можна тільки 7 робітників.
  //А так як в умові сказано запросити як найбільше робітників то робітники питимуть найдешевші напої.
  //Якщо ж віддавати перевагу першому зі списку вказаних напоїв і так далі,необхідно видалити ці 2 стрічки

  // перебираємо кожен обє'кт і сортуємо дані масиву summDrinks по вартості напоїв від найменшої до найбільшої
  //1-стрічка для видалення
  employeesWithSummDrinks.forEach(el => el.summDrinks.sort((a, b) => a - b));

  //сортуємо масив з об'єктами усіх робітників по кількості напоїв від найменшої(1) до найбільшої(3)
  //2-га стрічка для видалення
  employeesWithSummDrinks.sort((a, b) => a.summDrinks.length - b.summDrinks.length);

  //сортуємо масив з об'єктами усіх робітників по вартості першого у списку напою від найдешевшої до найдорожчої
  employeesWithSummDrinks.sort((a, b) => a.summDrinks[0] - b.summDrinks[0]);

  //   відфільтровуємо робітників на яких не вистачає грошей для напою
  const filteredEmployees = employeesWithSummDrinks.filter(el => {
    //перебираємо вартість всіх напоїв з масиву і повертаємо тільки таких на яких є кошти
    let q = false; //маркер який вказуватиме, що на напій є кошти і потрібно переходити до перевірки настумного робітника
    const mappedDrinks = el.summDrinks.map(drink => {
      if (budget > 0 && budget - drink > 0 && !q) {
        q = true; // на напій є кошти, умова більше не виконається і перевірка перейде до наступного робітника
        budget = budget - drink; //якщо є кошти - відмінусовуємо з бюджету вартість напою робітника
        delete el.summDrinks; // видаляємо поле 	summDrinks з об'єкту робітника.
        return el; //заносимо в масив mappedDrinks об'єкт робітника на якого вистачає коштів, в інпкшому разі undefined
      }
    });
    return mappedDrinks.some(el => el); //повертаємо ті об'єкти з робітниками,яким вистачило хоча б на 1 напій
  });

  //сортуємо масив робітників на яких вистачає коштів для напою по полю id  від найменшого до найбільшого
  return filteredEmployees.sort((a, b) => a.id - b.id);
}

//функція для додавання елементів масиву
function summ(arr) {
  return arr.reduce((el, acc) => el + acc);
}

const listInvited = invited(0.25); // виклик функції з бюджетом 0.25
console.log('invited:', listInvited);
