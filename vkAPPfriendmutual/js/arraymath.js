function ArrayMath() {

	this.Diff = function(A,B)
	{
		var M = A.length, N = B.length, c = 0, C = [];
		for (var i = 0; i < M; i++)
		{
			var j = 0, k = 0;
			while (B[j] !== A[ i ] && j < N) j++;
			while (C[k] !== A[ i ] && k < c) k++;
			if (j == N && k == c) C[c++] = A[ i ];
		}
		return C;
	}

	this.Intersection = function(A,B)
	{
	    var M = A.length, N = B.length, C = [],
	        m = 1, n = 1, k = 0, a = 0, b = 0;
	
	    for (var i = 1, t = A[0]; i < M; i++)  // Сдвигаем в начало уникальные элементы
	     { if (A[ i ] !== t)                   // Первые m-элементов будут уникальными
	        { A[m++] = A[ i ]; t = A[ i ]; }
	     }   
	  
	    for (var i = 1, t = B[0]; i < N; i++)  // Аналогично предыдущему
	     { if (B[ i ] !== t)
	        { B[n++] = B[ i ]; t = B[ i ]; }
	     }       
	
	    while (a < m && b < n)                // Заносим в C только те элементы A и B,
	     { if (A[ a ] < B[ b ]) ++a;          //  которые есть в них обоих
	       else if (A[ a ] > B[ b ]) ++b;
	       else С[k++] = A[a++];
	     }
	
	    return C;
	}

	this.Sum = function(A,B)
	{
		var M = A.length, N = B.length, count = 0, C = [];
		C = A;
		count = M;
		var cnt = 0;
		for (var i=0;i<N;i++)
		{ 
			var plus = false;
			for (var j=0;j<M;j++)
				if (C[j] == B[i]) {plus = true; break;}
			if (plus === false) C[count++] = B[i];
		}
		return C;
	}

	this.SymmetricDiff = function(A,B)
	{
		var M = A.length, N = B.length, c = 0, C = [];
		for (var i = 0; i < M; i++)
		{
			var j = 0, k = 0;
			while (B[j] !== A[ i ] && j < N) j++;
			while (C[k] !== A[ i ] && k < c) k++;
			if (j == N && k == c) C[c++] = A[ i ];
		}
		for (var i = 0; i < N; i++)
		{
			var j = 0, k = 0;
			while (A[j] !== B[ i ] && j < M) j++;
			while (C[k] !== B[ i ] && k < c) k++;
			if (j == M && k == c) C[c++] = B[ i ];
		}
		return C;
	}

}
var ArrMath = new ArrayMath();
