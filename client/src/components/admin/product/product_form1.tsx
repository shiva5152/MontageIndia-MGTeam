import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import instance from '@/utils/axios';
import { notifyError } from '@/utils/toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select, { MultiValue, ActionMeta, components } from 'react-select';
import useAdminAuth from '@/components/hooks/useAdminAuth';
import { categoriesOptions } from '@/utils/tempData';
import { Spinner } from '@nextui-org/react';
import Swal from 'sweetalert2';


const mediaOptions: {
  [ key: string ]: { value: string; label: string; };
} = {
  image: { value: 'image', label: 'Image' },
  video: { value: 'video', label: 'Video' },
  audio: { value: 'audio', label: 'Audio' }
};

const Form1 = ( { onNext }: any ) =>
{
  const { user } = useAdminAuth();
  const [ title, setTitle ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ mediaType, setMediaType ] = useState( '' );
  const [ tags, setTags ] = useState<string[]>( [] );
  const [ tagInput, setTagInput ] = useState( '' );
  const [ loading, setloader ] = useState( false );
  const [ selectedCategories, setSelectedCategories ] = useState<any[]>( [] );
  const [ availableCategories, setAvailableCategories ] = useState<any[]>( [] );
  const [ availableMediaOptions, setAvailableMediaOptions ] = useState<any[]>( [] );

  const CustomMenu = React.memo( ( props: any ) =>
  {
    const { selectProps, options, getValue } = props;
    const searchValue = selectProps.inputValue;
    const isExisting = options.some( ( option: any ) => option?.label?.toLowerCase() === searchValue?.toLowerCase() );
    const isSearching = searchValue && searchValue.length > 0;

    const handleAddClick = () =>
    {
      handleAddCategory( searchValue );
    };

    if ( isSearching && !isExisting && searchValue.trim() !== '' )
    {
      return (
        <components.MenuList { ...props }>
          { props.children }
          <div className="p-2">
            <button
              className="w-full bg-lime-400 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={ handleAddClick }
            >
              Add "{ searchValue }"
            </button>
          </div>
        </components.MenuList>
      );
    }
    return <components.MenuList { ...props }>{ props.children }</components.MenuList>;
  } );

  const handleAddCategory = React.useCallback( async ( categoryName: string ) =>
  {
    console.log( "category naem:", categoryName );
    try
    {
      const response = await instance.post( '/field/category', { category: categoryName } );
      if ( response.status === 201 )
      {
        const newCategory = {
          value: response.data.category._id,
          label: response.data.category.name
        };
        setAvailableCategories( prev => [ ...prev, newCategory ] );
        setSelectedCategories( prev => [ ...prev, newCategory ] );
      }
    } catch ( error )
    {
      console.error( "Error adding new category:", error );
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add new category. Please try again.',
      } );
    }
  }, [] );


  useEffect( () =>
  {
    if ( user )
    {
      console.log( "first", user.category[ 0 ] );
      // Check if user.category is 'all' or an array
      getCategories();
    

      if ( user.mediaType )
      {
        const allowedMediaOptions = Object.keys( mediaOptions )
          .filter( mediaType => user.mediaType.includes( mediaType ) )
          .map( mediaType => mediaOptions[ mediaType ] );
        setAvailableMediaOptions( allowedMediaOptions );
      }
    }
  }, [ user ] );

  const getCategories = async () =>
  {
    try
    {
      const response = await instance.get( '/field/category' );
      const formattedCategories = response.data.categories.map( ( category: any ) => ( {
        value: category._id,
        label: category.name
      } ) );
      setAvailableCategories( formattedCategories );
    } catch ( error )
    {
      console.log( "error in getting the category:-", error );
    }
  };

  const handleNext = async () =>
  {
    const uuid = uuidv4();
    const slug = slugify( title, { lower: true } );
    const data = { uuid, slug, title, description, mediaType, category: selectedCategories.map( c => c.label ), tags };
    setloader( true );
    try
    {
      const response = await instance.post( `/product/`, data, {
        headers: { 'Content-Type': 'application/json' }
      } );

      if ( response.status === 201 )
      {
        const data = response.data;
        console.log( data );
        setloader( false );
        onNext( data );
      }
    } catch ( error: any )
    {
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire( {
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      } );
      setloader( false );
      console.error( 'Error sending data:', error );
    }
  };

  const handleTagKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) =>
  {
    if ( e.key === 'Enter' )
    {
      e.preventDefault();
      if ( tagInput.trim() )
      {
        setTags( [ ...tags, tagInput.trim() ] );
        setTagInput( '' );
      }
    }
  };

  const isFormValid = () =>
  {
    return title && description && mediaType && tags[ 0 ] && selectedCategories.length > 0;
  };

  const handleCategoryChange = ( newValue: MultiValue<any>, actionMeta: ActionMeta<any> ) =>
  {
    setSelectedCategories( newValue as any[] );
  };



  return ( <>
    { loading ? <>
      <div role="status" className='justify-center h-screen flex items-center m-auto'>
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-lime-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">
          <Spinner label="Loading..." color="success" />
        </span>
      </div>
    </> : ( <>

      <div className='flex flex-col gap-5'>
        <div>
          <span className='text-lg mb-3 font-semibold mr-4'>Media Type</span>
          <select
            className='text-gray-700 outline-none font-semibold py-3 select-none p-2 bg-gray-100 rounded-lg'
            value={ mediaType }
            onChange={ ( e ) => setMediaType( e.target.value ) }
          >
            <option className='font-semibold hover:text-gray-800' value="" disabled>Select Media</option>
            { availableMediaOptions.map( option => (
              <option key={ option.value } className='font-semibold text-cyan-800' value={ option.value }>
                { option.label }
              </option>
            ) ) }
          </select>
        </div>
        <div className='flex gap-3 flex-col'>
          <span className='text-xl font-semibold'>Title</span>
          <input
            placeholder="Enter Title"
            className='text-gray-700 outline-none py-3 p-2 bg-gray-100 rounded-lg'
            value={ title }
            onChange={ ( e ) => setTitle( e.target.value ) }
          />
        </div>
        <div>
          <span className='text-xl font-semibold'>Description</span>
          <ReactQuill theme="snow" className='h-52 mt-4 mb-8' value={ description } onChange={ setDescription } />
        </div>
        <div>
          <span className='text-xl mb-3 font-semibold mr-4'>Category</span>
          {/* <Select
            isMulti
            name="categories"
            options={availableCategories}
            className='basic-multi-select'
            classNamePrefix="select"
            value={selectedCategories}
            onChange={handleCategoryChange}
          /> */}
          <Select
            isMulti
            name="categories"
            options={ availableCategories }
            className='basic-multi-select'
            classNamePrefix="select"
            value={ selectedCategories }
            onChange={ handleCategoryChange }
            components={ { MenuList: CustomMenu } }
          // onAddCategory={ handleAddCategory }  
          />
        </div>
        <div>
          <span className='text-lg mb-3 font-semibold mr-4'>Tags</span>
          <input
            placeholder="Tags-labels"
            className='text-gray-700 outline-none py-3 p-2 bg-gray-100 rounded-lg'
            value={ tagInput }
            onChange={ ( e ) => setTagInput( e.target.value ) }
            onKeyDown={ handleTagKeyDown }
          />
        </div>
        <div className='flex flex-wrap gap-2'>
          { tags.map( ( tag, index ) => (
            <span key={ index } className='bg-gray-200 font-medium text-black px-2 py-1 rounded'>
              { tag }
            </span>
          ) ) }
        </div>
        <button
          onClick={ handleNext }
          className={ `p-2 px-3 w-36 text-center items-center m-auto justify-center font-semibold flex text-white rounded-lg ${ isFormValid() ? 'bg-lime-400 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
            }` }
          disabled={ !isFormValid() }
        >
          Save & continue
        </button>
      </div></>
    ) }
  </> );
};

export default Form1;
