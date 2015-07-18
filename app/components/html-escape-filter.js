angular.module('WaffleApp').filter('htmlEscape', ['$sce', function ($sce) {
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function nl2br(text) {
        return (text || '').replace(/\n/g, '<br />');
    }

    return function (text, useNl2br) {
        var input = text || '';

        var output = escapeHtml(input);
        if (useNl2br) {
            output = nl2br(output);
        }

        return $sce.trustAsHtml(output);
    };
}]);