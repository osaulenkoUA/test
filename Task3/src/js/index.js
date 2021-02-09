import employees from '../data/employees.json';
import recipes from '../data/recipes.json';
import prices from '../data/prices.json';

//Створюємо масив з назвами напоїв
const arrDrinks = Object.keys(recipes);

//створюємо масив arrCostDrinks з об`єктами - назва напою : ціна напою
const arrCostDrinks = arrDrinks.map((el) => {
	//---ціна кофе для кожного напою
	const costCoffee = recipes[el].coffee === undefined ? 0 : (recipes[el].coffee * prices.coffee).toFixed(3);

	//---ціна води для кожного напою
	const costWater = recipes[el].water === undefined ? 0 : (recipes[el].water * prices.water).toFixed(3);

	//---ціна молока для кожного напою
	const costMilk = recipes[el].milk === undefined ? 0 : (recipes[el].milk * prices.milk).toFixed(3);

	//---додаємо ціну кофе,ціну молока, ціну води для кожного напою
	const costProduct = +(Number(costCoffee) + Number(costWater) + Number(costMilk)).toFixed(3);

	return {
		[el]: costProduct, //---повертаємо об'єкт з назва напою : ціна напою
	};
});

//фунція invited повертає масив з employees that should be invited
function invited(m) {
	let budget = m;

	//створюємо новий масив з об'єктами employee кожен якого додатково містить
	//поле з сумою/вартістю всіх випивок
	const employeesWithSummDrinks = employees.map((el) => {
		//--- costCurrentDrink- масив з вартістю випивок для конкретного робітника
		const costCurrentDrink = el.drinks.map((drink) => {
			const arr = arrCostDrinks.map((el) => {
				if (el.hasOwnProperty(drink)) return el[drink]; //перевірка чи є з загального списку випивок-випивки робітника
				return 0;
			});
			return summ(arr); //---summ функція для сумування елементів масиву
		});

		//---------
		return { ...el, summDrinks: costCurrentDrink }; //добавляє в об'єкт суму/вартість випивок
	});
	//сортуємо масив по вартості випивок від найменшої до найбільшої
	employeesWithSummDrinks.forEach((el) => el.summDrinks.sort((a, b) => a - b));
	employeesWithSummDrinks.sort((a, b) => a.summDrinks.length - b.summDrinks.length);

	employeesWithSummDrinks.sort((a, b) => a.summDrinks[0] - b.summDrinks[0]);
	console.log(employeesWithSummDrinks);

	//   відфільтровуємо робітників на яких не вистачає грошей для випивки
	const filteredEmployees = employeesWithSummDrinks.filter((el) => {
		//перебираємо вартість всіх випивок з масиву і повертаємо тільки таих на яких є кошти
		const mappedDrinks = el.summDrinks.map((drink) => {
			if (budget > 0 && budget - drink > 0) {
				budget = budget - drink; //якщо є кошти - відмінусовуємо з бюджету вартість випивок робітника
				return delete el.summDrinks; //заносимо в масив mappedDrinks об'єкт робітника на якого вистачає коштів, в інпкшому разі по замовчуванні undefined
			}
		});
		return mappedDrinks[0] !== undefined; //повертаємо тільки тих робітників на які вистачає коштів--відфільтровуємо undefined з масиву.
	});

	//сортуємо масив робітників на яких вистачає коштів по полю id  від найменшого до найбільшого

	return filteredEmployees.sort((a, b) => a.id - b.id);
}

//функція для додавання елементів масиву
function summ(arr) {
	return arr.reduce((el, acc) => el + acc);
}

const listInvited = invited(0.25); // виклик функції з бюджетом 0.25
console.log(listInvited);
