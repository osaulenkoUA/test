function findVariants(x, y, z, w) {
	const arr = [x, y, z].sort((a, b) => a - b);//заносимо в масив  та сортуємо по зростанню вхідні дані масс подарунків

	const count = Math.trunc(w / arr[0]); // ділимо масу W на масу найлегшого елемента,брем цілу частину без залишку,Визначаємо для зовнішнього цикла кількість ітерацій
	const count2 = Math.trunc(w / arr[1]);// теж саме тільки для другого елемента масиву. Кількість ітерацій для внутрішнього циклу

  let quantities = 0;
  
	for (let i = 0; i <= count; i++) {

		let v1 = arr[0] * (count - i); //ОТРИМУЄМО ЗНАЧЕННЯ ПЕРШОГО ЕЛЕМЕНТА(НУЛЬОВОГО) ПОМНОЖЕНОГО НА СOUNT-i ДО 0  
		if (v1 === w) quantities = quantities + 1;  //КОЛИ  ЗНАЧЕННЯ ПЕРШОГО ЕЛЕМЕНТА(НУЛЬОВОГО) === W - ПЛЮСУЄМО ДО quantities

		for (let idx = 1; idx <= count2; idx++) {

			const s1 = v1 + arr[1] * idx;   //СУМА ПЕРШОГО ЕЛЕМЕНТА(НУЛЬОВОГО) + СУМА ДРУГОГО ПОМНОЖЕНОГО НА IDX (ВІД 1 ДО  count2)
			const s2 = v1 + arr[2] * idx;   ////СУМА ПЕРШОГО ЕЛЕМЕНТА(НУЛЬОВОГО) + СУМА ТРЕТЬОГО ПОМНОЖЕНОГО НА IDX (ВІД 1 ДО  count2)
      const s3 = v1 + arr[1] * idx + arr[2] * idx; //СУМА ПЕРШОГО ЕЛЕМЕНТА(НУЛЬОВОГО) + СУМА ДРУГОГО ПОМНОЖЕНОГО НА IDX+ СУМА ТРЕТЬОГО ПОМНОЖЕНОГО НА IDX
      
			if (s1 === w) quantities = quantities + 1; //
			if (s2 === w) quantities = quantities + 1; // ЯКЩО СУМА ПОДАРУНКІВ === МАСІ W ПЛЮСУЄМО ДО quantities
			if (s3 === w) quantities = quantities + 1; //
		}
	}
	return quantities;
}

const quantitieVariant = findVariants(10,25,15,40);
console.log(quantitieVariant);
