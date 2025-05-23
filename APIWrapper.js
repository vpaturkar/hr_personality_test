var _Debug = false;  // set this to false to turn debugging off
// and get rid of those annoying alert boxes.

// Define exception/error codes
var _NoError = 0;
var _GeneralException = 101; 
var _InvalidArgumentError = 201;
var _NotInitialized = 301;
var _NotImplementedError = 401;


// local variable definitions
var apiHandle = null;

function LMSInitialize() 
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSInitialize was not successful.");
      return false;
   }

   // call the LMSInitialize function that should be implemented by the API
   var emptyString = new String("");

   var initResult = api.LMSInitialize(emptyString);

   if (initResult.toString() != "1")
   {
      // LMSInitialize did not complete successfully.

      // Note: An assumption is made that if LMSInitialize returns a non-true
      //		 value, then and only then, an error was raised.

      // Note: Each function could define its own error handler, but we'll 
      // just implement a generic one in this example.
      var err = ErrorHandler();
   }

   return initResult;
   
} 

function LMSFinish()
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSFinish was not successful.");
   }
   else
   {
      // call the LMSInitialize function that should be implemented by the API
      var emptyString = new String("");
      api.LMSFinish(emptyString);
      var err = ErrorHandler();
   }   

   return;
   
} 

function LMSGetValue(name)
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetValue was not successful.");
      return null;
   }
   else
   {
      var value = api.LMSGetValue(name);
      var err = ErrorHandler();
      // if an error was encountered, then return null, 
      // else return the retrieved value
      if (err != _NoError)
      {
         return null;
      }
      else
      {
         return value.toString();
      }
   }   
}

function LMSSetValue(name, value) 
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSSetValue was not successful.");
   }
   else
   {
      api.LMSSetValue(name, value);
      var err = ErrorHandler();
   }   

   return;
}

function LMSCommit()
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSCommit was not successful.");
   }
   else
   {
      // call the LMSInitialize function that should be implemented by the API
      var emptyString = new String("");
      api.LMSCommit(emptyString);
      var err = ErrorHandler();
   }   

   return;
   
} 

function LMSGetLastError() 
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetLastError was not successful.");
      //since we can't get the error code from the LMS, return a general error
      return _GeneralError;
   }


   return api.LMSGetLastError().toString();
   
} 

function LMSGetErrorString(errorCode) 
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetErrorString was not successful.");
   }

   return api.LMSGetErrorString(errorCode).toString();
   
} 

function LMSGetDiagnostic(errorCode) 
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetDiagnostic was not successful.");
   }

   return api.LMSGetDiagnostic(errorCode).toString();
   
} 

function LMSIsInitialized()
{
   // there is no direct method for determining if the LMS API is initialized
   // for example an LMSIsInitialized function defined on the API so we'll try
   // a simple LMSGetValue and trap for the LMS Not Initialized Error
   
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSIsInitialized() failed.");
      // no choice but to return false.
      return false;
   }
   else
   {
      var value = api.LMSGetValue("cmi.core.student_name");
      var errCode = api.LMSGetLastError().toString();
      if (errCode == _NotInitialized)
      {
         return false;
      }
      else
      {
         return true;
      }
   }   
}


function ErrorHandler() 
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nCannot determine LMS error code.");
      return;
   }

   // check for errors caused by or from the LMS
   var errCode = api.LMSGetLastError().toString();
   if (errCode != _NoError)
   {
      // an error was encountered so display the error description
      var errDescription = api.LMSGetErrorString(errCode);
      
      if (_Debug == true)
      {
         errDescription += "\n";
         errDescription += api.LMSGetDiagnostic(null);
         // by passing null to LMSGetDiagnostic, we get any available diagnostics
         // on the previous error.
      }

      alert(errDescription);
   }

   return errCode;
}

function getAPIHandle() 
{
   if (apiHandle == null)
   {
      apiHandle = getAPI();
   } 

   return apiHandle;
}

function findAPI(win) 
{

   // Search the window hierarchy for an object named "API"  
   // Look in the current window (win) and recursively look in any child frames
   

   if (_Debug)
   {
      alert("win is: "+win.location.href);
   }


   if (win.API != null)
   {
      if (_Debug)
      {
         alert("found api in this window");
      }
      return win.API;
   }

   if (win.length > 0)  // does the window have frames?
   {
      if (_Debug)
      {
         alert("looking for api in windows frames");
      }

      for (var i=0;i<win.length;i++)
      {

         if (_Debug)
         {
            alert("looking for api in frames["+i+"]");
         }
         var theAPI = findAPI(win.frames[i]);
         if (theAPI != null)
         {
            return theAPI;
         }
      }
   }

   if (_Debug)
   {
      alert("didn't find api in this window (or its children)");
   }
   return null;

}


function getAPI()
{

   // start at the topmost window - findAPI will recurse down through
   // all of the child frames
   var theAPI = findAPI(this.top);

   if (theAPI == null)
   {
      // the API wasn't found in the current window's hierarchy.  If the
      // current window has an opener (was launched by another window),
      // check the opener's window hierarchy. 
      if (_Debug)
      {
         alert("checking to see if this window has an opener");
         alert("window.opener typeof is> "+typeof(window.opener));
      }

      if (typeof(this.opener) != "undefined")
      {
         if (_Debug)
         {
            alert("checking this windows opener");
         }
         if (this.opener != null)
         {
            if (_Debug)
            {
               alert("this windows opener is NOT null - looking there");
            }
            theAPI = findAPI(this.opener.top);
         }
         else
         {
            if (_Debug)
            {
               alert("this windows opener is null");
            }
         }
      }
   }

   return theAPI;
}


