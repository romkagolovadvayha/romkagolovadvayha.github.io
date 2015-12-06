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

	this.Intersection = function(X,Y)
	{
		var n = X.length, m = Y.length, i=0, k=0, j=0, Z = [];
		
		while ((i<=n-1)&(j<=m-1)) {
			if (X[i] == Y[j])
			{
				Z[k] = X[i];
				k++;
				i++;
				j++;
			} else {
				if (X[i] < Y[j]) {
					i++;
				} else {
					j++;
				}
			}
		}
	 	return Z;
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
