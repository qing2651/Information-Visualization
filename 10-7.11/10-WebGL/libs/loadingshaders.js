function loadingVertexShader()
{
	var vs_source = null;
	var xhr = new XMLHttpRequest();

	xhr.open('GET', 'shaders/shader_vs.txt', false);
	xhr.overrideMimeType('text/xml');
	xhr.send(null);
	if (xhr.readyState == xhr.DONE) 
	{
		if(xhr.status === 200)
		{
			vs_source = xhr.responseXML.documentElement.firstChild.data;
		} 
		else 
		{
			console. error("Error: " + xhr.statusText);
		}
	}

	return vs_source;
};

function loadingFragmentShader()
{
	var fs_source = null;
	var xhr = new XMLHttpRequest();

	xhr.open('GET', 'shaders/shader_fs.txt', false);
	xhr.overrideMimeType('text/xml');
	xhr.send(null);
	if (xhr.readyState == xhr.DONE) 
	{
		if(xhr.status === 200)
		{
			fs_source = xhr.responseXML.documentElement.firstChild.data;
		} 
		else 
		{
			console. error("Error: " + xhr.statusText);
		}
	}
	return fs_source;
};