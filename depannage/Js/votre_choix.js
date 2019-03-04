function Lien() {
	i = document.frmSite.site.selectedIndex;
	if (i == 0) return;
	url = document.frmSite.site.options[i].value;
	parent.location.href = url;
}
//frmSite corespond a 		<FORM name="frmSite">
//site corespond a     <SELECT name="site">

